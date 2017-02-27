var lastTwoPositions = [];

var datum_method_options = {
        xtype: 'combobox',
        id:"datum_method_options",
        triggerAction: 'all',
        lazyRender:true,
        width:400,
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
                'ID','METHOD'
            ],
            data: [["POINT_DATUM","Point Datum"],["LINE_DATUM","Line Datum"],["BACKTRACK_DATUM","Backtrack"]]
        }),
        fieldLabel:"Datum Method",
        valueField: 'ID',
        displayField: 'METHOD',
        listeners:{
            change:function(combo){
                
                var selectedID = combo.findRecordByValue(combo.getValue()).data.ID;
                
                Ext.getCmp("datum_method_selected").setValue(selectedID);
                
                ClearAll();
                
                if(selectedID == "POINT_DATUM"){
                    Ext.getCmp("point_datum_parameters").show();
                    Ext.getCmp("method_options_control_line").hide();
                    Ext.getCmp("uploaded_results").hide();
                    Ext.getCmp("backtrack_datum_parameters").hide();
                    datum_mode="POINT_DATUM";
                }
                else if(selectedID == "LINE_DATUM"){
                    Ext.getCmp("point_datum_parameters").hide();
                    Ext.getCmp("missed_object_coords_control").hide();
                    Ext.getCmp("method_options_control_line").show();
                    Ext.getCmp("backtrack_datum_parameters").hide();
                    datum_mode="LINE_DATUM";
                }
                else if(selectedID == "BACKTRACK_DATUM"){
                    Ext.getCmp("point_datum_parameters").hide();
                    Ext.getCmp("missed_object_coords_control").hide();
                    Ext.getCmp("method_options_control_line").hide();
                    Ext.getCmp("uploaded_results").hide();
                    Ext.getCmp("backtrack_datum_parameters").show();
                    
                }
                else{
                    
                }
            }
        }
};

var missed_object_coords_control= {
        xtype: 'fieldset',
        id:"missed_object_coords_control",
        flex: 1,
        title: '<b>Missed Object Coordinates</b>',
        layout: 'anchor',
       // hidden:true,
        defaults: {
            anchor: '100%',
            hideEmptyLabel: false
        },
        hidden:true,
        style:'padding:20px',
        items:[{
                xtype: 'textfield',
                id:"txt_missed_lat",
                name: "txt_missed_lat",
                fieldLabel:"Latitude",
            }, {
                xtype: 'textfield',
                id:"txt_missed_lon",
                name: "txt_missed_lon",
                fieldLabel:"Longitude",
            }]
};

var point_datum_parameters = {
        xtype: 'fieldset',
        flex: 1,
        id:"point_datum_parameters",
        title: '<b>Point Method Initialisation</b>',
        defaultType: 'button', // each item will be a checkbox
        layout: 'anchor',
        hidden:true,
        defaults: {
            anchor: '100%',
            hideEmptyLabel: false
        },
        style:'padding:20px',
        items:[{
                xtype: 'button',
                name: 'txt-test1',
                width:200,
                text: 'Clik on map',
                handler:function(){
                            clickCtl.callback_fn=function(latlon){ 

                            var pointFromMap = latlon.transform("EPSG:3857", "EPSG:4326");
                            var clickLat = pointFromMap.lat;
                            var clickLon = pointFromMap.lon;

                            Ext.getCmp("missed_object_coords_control").show();
                            Ext.getCmp("txt_missed_lat").setValue(clickLat.toFixed(5));
                            Ext.getCmp("txt_missed_lon").setValue(clickLon.toFixed(5));                                   
                            this.deactivate();          
                        }

                        clickCtl.activate();                                              
                    }                                    
                },
                {
                    xtype: 'button',
                    width:200,
                    name: 'use_coords_btn',
                    text: 'Use coordinates',
                    handler:function(){
                        showCoordsPanel(true);
                    }
            }]
    };
//line

var method_options_control_line= {
                        xtype: 'fieldset',
                        flex: 1,
                        id:"method_options_control_line",
                        title: '<b>Line Method Initialisation</b>',
                        defaultType: 'button', // each item will be a checkbox
                        layout: 'anchor',
                        hidden:true,
                        defaults: {
                            anchor: '100%',
                            hideEmptyLabel: false
                        },
                        items:[ 
                               {   
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items:[
                                        {
                                         xtype:'form',
                                         id: 'frm_add_wpSim',
                                         defaultType : 'field',
                                         frame:true,
                                         items:[
                                            {
                                                xtype: 'fileuploadfield',
                                                id: 'wp_fileuplod_control',
                                                width : 270,
                                                emptyText: 'Select csv file to upload...',
                                                buttonText: 'Browse',
                                                name: 'file',

                                            },
                                            {
                                               xtype:"button",
                                               text:"Upload",
                                               style: 'margin-left: 5px',
                                               handler:function(){
                                                   var wpForm = Ext.getCmp("frm_add_wpSim");
                                                   wpForm.submit({
                                                        url: 'modules/wp_files.php',
                                                        waitMsg: 'Uploading your file...',
                                                        success: function (f, a) {
                                                                 
                                                                  lastTwoPositions.length=0;
                                                            
                                                                  var s=""; 
                                                                  var result = a.result, data = result.data,
                                                                  name = data.name, size = data.size;
                                                                  
                                                                  parseWKTGeom(result.line,function(lineString){

                                                                     Ext.getCmp("method_options_control_line").hide();
                                                                     Ext.getCmp("uploaded_results").show();
                                                                     Ext.getCmp("lbl_filename").setText(name);
                                                                     Ext.getCmp("lbl_length").setText(lineString.getLength().toFixed(2));

                                                                     var vertices = lineString.getVertices();

                                                                     for(var i=0;i<vertices.length;i++){
                                                                      
                                                                          var newPointFromText =  new OpenLayers.Geometry.Point(vertices[i].x, vertices[i].y);
                                                                          var newPointFromTextTransformed = newPointFromText.transform( "EPSG:900913","EPSG:4326");
                                                                         s+=newPointFromTextTransformed.x + " " + newPointFromTextTransformed.y +",";
                                                                         
                                                                         if( i==vertices.length-2 || i == vertices.length-1 ){
                                                                             lastTwoPositions.push(vertices[i].x);
                                                                             lastTwoPositions.push(vertices[i].y);
                                                                         }
                                                                     }                                                                 
                                                                      
                                                                     s = s.substring(0,s.length-1);  

                                                                     Ext.getCmp("hiddenlinestring").setValue(s);

                                                                     Ext.getCmp("lbl_points").setText(vertices.length);
                                                                      console.log(lastTwoPositions);
                                                                      
                                                                      
                                                                      var theta = (Math.atan2((lastTwoPositions[3] - lastTwoPositions[1]),  (lastTwoPositions[2] - lastTwoPositions[0]))) *  (180/Math.PI);
                                                                      
                                                                      var normalizedTheta = theta<0?theta+360:theta;
                                                                      
                                                                      console.log(normalizedTheta);
                                                                      
                                                                      var line_datum_pars = CalulatePerpendiculars(lastTwoPositions[0],lastTwoPositions[1],lastTwoPositions[2],lastTwoPositions[3],normalizedTheta);
                                                                      
                                                                 });
                                                                    
                                                        },
                                                        failure: function (f, a) {
                                                          Ext.Msg.alert('Failure', a.result.msg);
                                                        }});
                                               }
                                    }]}]
                                }
                        ]
                    };

var uploaded_results = {
                 xtype:"fieldset",
                 title: '<b>Route Data</b>',
                 id:"uploaded_results",
                 hidden:true,
                 layout: 'fit',
                 defaults: {
                    anchor: '100%',
                    hideEmptyLabel: false
                 },
                items:[{
                    xtype:"panel",
                    height:100,
                    bodyStyle: 'padding:5px 5px 0',
                    layout:{
                            type: 'table',
                            columns: 2,
                            tableAttrs: 
                                {
                                  style: {width: '100%'}                                 
                                }
                            },
                    columns: 2,
                    items:[{
                                xtype:"label",
                                html:"<b>Name</b>",
                            },
                            {
                                xtype:"label",
                                id:"lbl_filename",
                                text:"",
                            },
                            {
                                xtype:"label",
                                html:"<b>Route Length</b>",
                            },
                            {
                                xtype:"label",
                                id:"lbl_length",
                                text:"",

                            },
                            {
                                xtype:"label",                       
                                html:"<b>Points</b>",
                            },
                           {
                                xtype:"label",
                                id:"lbl_points",
                                text:"",

                            }
                        ]
                },
                {
                    xtype: 'hidden',
                    id: 'hiddenlinestring',                                           
                    name: 'hiddenlinestring',
                }]
            };
                


var backtrack_datum_parameters= {
        xtype: 'fieldset',
        id:"backtrack_datum_parameters",
        flex: 1,
        title: '<b>Back Track Coordinates</b>',
        layout: 'anchor',
       // hidden:true,
        defaults: {
            anchor: '100%',
            hideEmptyLabel: false
        },
        hidden:true,
        style:'padding:20px',
        items:[{
                xtype: 'textfield',
                id:"bactrack_lat_last_position",
                name: "bactrack_lat_first_position",
                fieldLabel:"Departure Latitude",
            }, 
            {
                xtype: 'textfield',
                id:"bactrack_lon_last_position",
                name: "bactrack_lon_first_position",
                fieldLabel:"Departure Longitude",
            },
            {
                xtype: 'textfield',
                id:"bactrack_lat_dept_position",
                name: "bactrack_lat_dept_position",
                fieldLabel:"Last known Latitude",
            }, {
                xtype: 'textfield',
                id:"bactrack_lon_dept_position",
                name: "bactrack_lon_dept_position",
                fieldLabel:"Last known Longitude",
            },
            ]
};

var datum_method_selected = {
                xtype: 'textfield',
                id:"datum_method_selected",
                name: "datum_method_selected",
                hidden:true
}


var datum_method_tab ={
     title:"Datum Method",
     id:"datum_method_tab",
     items:[ {
          xtype: 'form',
          frame:true,
          height   : 480,
          layout:'anchor',
          items:[datum_method_options,point_datum_parameters,missed_object_coords_control,method_options_control_line,uploaded_results,backtrack_datum_parameters,datum_method_selected]
         }      
        //aws_avg_sur_wind,
        //aws_probable_error,
        //leeway_calculations
        ]
};

function ClearAll(){

if(Ext.getCmp("bactrack_lat_last_position"))
    Ext.getCmp("bactrack_lat_last_position").setValue(null);
    
if(Ext.getCmp("bactrack_lon_last_position")) 
    Ext.getCmp("bactrack_lon_last_position").setValue(null);
    
if (Ext.getCmp("bactrack_lat_first_position"))
    Ext.getCmp("bactrack_lat_first_position").setValue(null);
    
if (Ext.getCmp("bactrack_lon_first_position"))  
    Ext.getCmp("bactrack_lon_first_position").setValue(null);

if(Ext.getCmp("txt_missed_lat"))
    Ext.getCmp("txt_missed_lat").setValue(null);
    
if(Ext.getCmp("txt_missed_lon"))
    Ext.getCmp("txt_missed_lon").setValue(null);
    
if (Ext.getCmp("lbl_length"))
    Ext.getCmp("lbl_length").setText(null);
    
lastTwoPositions = [];
 
}
function HideLineMethodOptions(){
    
}
function HideBackTrackMethodOptions(){
    
}
var line_datum_parameters = {
    
};




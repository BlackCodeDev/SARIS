 var lastTwoPositions = [];

var map_layers_cmb = {
                                xtype: 'combo',
                                width:400,
                                id:"map_layers_cmb",
                                fieldLabel: 'Select Layer to Use',
                                hiddenName: 'maplayerscmb',
                                store: new Ext.data.SimpleStore({
                                    data: search_factor_ds,
                                    id: 0,
                                    fields: ['factor_id','factor_value','factor_grid_system','factor_grid_system_cells']
                                }),
                                valueField: 'factor_id',
                                displayField: 'factor_value',
                                triggerAction: 'all'
};


var method_options_control_line= {
                        xtype: 'fieldset',
                        flex: 1,
                        id:"fieldSet_method_options",
                        title: '<b>Line Method Initialisation</b>',
                        defaultType: 'button', // each item will be a checkbox
                        layout: 'anchor',
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

                                                                     Ext.getCmp("fieldSet_method_options").hide();
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
                



var dr_options_control_line = {
                            xtype: 'fieldcontainer',
                            labelWidth: 100,
                            layout: 'hbox',
                            items: [{
                                        xtype: 'label',
                                        text: 'Dead Reckoning:',
                                    },
                                    {
                                        xtype: 'radio',
                                        id: 'yesDRLine',
                                        name: 'rbGroup',
                                        checked: false,
                                        hideLabel: false,
                                        labelSeparator: '',
                                        hideLabel: true,
                                        boxLabel: 'Yes',
                                        fieldLabel: 'Yes',
                                        style: 'margin-left: 10px',
                                        handler:function(){
                                            var drD = Ext.getCmp("drDistanceLine");
                                            drD.setValue(null);
                                            drD.hide();
                                        }
                                    }, 
                                    {
                                       xtype:"textfield",
                                       id:"drDistanceLine",
                                       name:"drDistanceLine",
                                       hidden : true,
                                       style:"margin-left:5px",
                                       "emptyText":"DR in Nautical Miles"
                                    },
                                    {
                                        xtype: 'radio',
                                        text:'No',
                                        id: 'noDRLine',
                                        name: 'rbGroup',
                                        checked: true,
                                        hideLabel: true,
                                        boxLabel: 'No',
                                        fieldLabel: 'No',
                                        style: 'margin-left: 10px',
                                        handler:function(){
                                            var drD = Ext.getCmp("drDistanceLine");
                                            drD.setValue(null);
                                            drD.show();
                                        }
                                    }                                
                                   ]
                          };



var search_factor_cmb_line = {
                                xtype: 'combo',
                                width:400,
                                id:"search_factor_cmb_line",
                                fieldLabel: 'Search_Factor',
                                hiddenName: 'searchFactor',
                                store: new Ext.data.SimpleStore({
                                    data: search_factor_ds,
                                    id: 0,
                                    fields: ['factor_id','factor_value','factor_grid_system','factor_grid_system_cells']
                                }),
                                valueField: 'factor_id',
                                displayField: 'factor_value',
                                triggerAction: 'all',
    
}

var vessel_device_type_cmb_line =  {
                                xtype: 'combo',
                                width:400,
                                id:"vessel_position_cmb_line",
                                fieldLabel: 'Select Device',
                                hiddenName: 'deviceType',
                                store: new Ext.data.SimpleStore({
                                    data: vessel_position_devices_ds,
                                    id: 0,
                                    fields: ['device_id','device_error', 'device_type']
                                }),
                                valueField: 'device_id',
                                displayField: 'device_type',
                                triggerAction: 'all'
                            };

var vessel_vessel_type_line = {
                            xtype: 'combo',
                            width:400,
                            id:"vessel_type_cmb_line",
                            fieldLabel: 'Select Craft Type',
                            hiddenName: 'craftType',
                            store: new Ext.data.SimpleStore({
                                data:vessel_types_ds,
                                id: 0,
                                fields: ['vsl_type_id','vsl_type_error','DR_error','vsl_type_name']
                            }),
    
                            valueField: 'vsl_type_id',
                            displayField: 'vsl_type_name',
                            triggerAction: 'all'                               
                        };

var incident_name_control_line = {
    xtype:"textfield",
    id:"incident_name_control_line",
    name:"incident_name_control_line",
    fieldLabel:"Incident Name",
    width:400
};

var missing_object_name_control_line = {
    xtype:"textfield",
    id:"missing_object_name_control_line",
    name:"missing_object_name_control_line",
    fieldLabel:"Missing Object Name",
    width:400
};

var incident_date_line = {
    xtype:"datefield",
    format: 'd/m/Y',
    id:"sim_date_line",
    name:"sim_date_line",
    fieldLabel:"Date",
    width:400
};
var incident_time_line = {
    xtype:"timefield",
    id:"sim_time_line",
    name:"sim_time_line",
    fieldLabel:"Time",
    format : 'H:i',
    width:400
};

var leftsidePanelLine =         {
                            xtype: 'fieldset',
                            flex: 1,
                            title: '<b>Input Data</b>',
                            layout: 'anchor',
                            defaults: {
                            anchor: '100%',
                            hideEmptyLabel: false
                                },
                            items:[incident_name_control_line,missing_object_name_control_line,incident_date_line,incident_time_line,vessel_device_type_cmb_line,vessel_vessel_type_line,search_factor_cmb_line,dr_options_control_line,method_options_control_line,uploaded_results]
                            }

var line_datum_form_panel = {
                                xtype       : 'form',
                                autoHeight   : true,
                                autoWidth   : true,
                                autoScroll  : true,
                                id          : 'line_datum_form_panel',
                                defaultType : 'field',
                                frame       : true,
                                layout:"hbox",
                                title       : 'Define Datum Line',
                                items       :[leftsidePanelLine],
                                buttons:[
                                    {
                                        xtype:"button",
                                        text:"Simulate"
                                    },
                                    {
                                        xtype:"button",
                                        text:"Save Insident",
                                        handler:function(){
                                        
                                        var incident={                                          
                                                TASK:"INSERT",
                                                ENTITY:"saris_simulations_line",
                                                VALUES:{
                                                     INCIDENT_NAME:Ext.getCmp("incident_name_control_line").getValue()!=""?Ext.getCmp("incident_name_control_line").getValue():null,
                                                     CRAFT_NAME:Ext.getCmp("missing_object_name_control_line").getValue()!=null?Ext.getCmp("missing_object_name_control_line").getValue():null,
                                                     DATE:Ext.getCmp("sim_date_line").getValue(),
                                                     TIME:TimeToString(Ext.getCmp("sim_time_line").getValue()),
                                                     POSITION_DEVICE_ID:Ext.getCmp("vessel_position_cmb_line").getValue(),
                                                     CRAFT_TYPE_ID:Ext.getCmp("vessel_type_cmb_line").getValue(),
                                                     SEARCH_FACTOR_ID:Ext.getCmp("search_factor_cmb_line").getValue(),
                                                     DEAD_RECKONING:Ext.getCmp("drDistanceLine").getValue() != null?parseFloat(Ext.getCmp("drDistanceLine").getValue()):null,
                                                     INCIDENT_ROUTE: Ext.getCmp("hiddenlinestring").getValue()
                                                        
                                                }
                                        };
                                        if(Ext.getCmp("hiddenlinestring").getValue() != null){
                                        SendRequestToGProcess("http://localhost:81/Saris/servlets_proxy.php","DataDb",incident,function(data){
                                                   
                                                    //TO DO PROCESS REQUEST FROM GEOMETRY SERVICES
                                                    Ext.Msg.alert(data.Result, data.Data);
                                        
                                                }
                                            );}
                                        else {
                                         Ext.Msg.alert("Warning", "Please select Route");
                                        }
                                    
                                        }
                                    }
                                    
                                ]
                            };

function showDatumLineWindow(){

        var line_datum_win = new Ext.Window({
                                id:'line_datum_window',
                                autoHeight :true,
                                autoWidth   : true,
                                items  : [line_datum_form_panel]
        });
    
        line_datum_win.show();
}




function GetErrorBasedOnDRLine(){
    
    var drDistanceLineValue  = Ext.getCmp("drDistanceLine").getValue();
    
    if(drDistanceLineValue != null && isControlTypeSelected("vessel_type_cmb_line")){
       
       var selectedVesselType = Ext.getCmp("vessel_type_cmb_line");
       var ctl = Ext.getCmp("vessel_type_cmb_line");
       var record = ctl.findRecordByValue(ctl.getValue());
        
       return ((record.data.DR_error * 1852) * drDistanceLineValue);
    }
    else{
        return 0;
    }
}


function LoadSavedIncidentsLine(){
       
   var reqObj={
         TASK:"SELECT",
         ENTITY:"saris_simulations_line",
         VALUES:{}
   };

  
  var urlReq = "http://localhost:81/Saris/servlets_proxy.php?servlet=DataDb&data=" + Ext.JSON.encode(reqObj);
    
    
  var gridLineIncidentsStore = new Ext.data.JsonStore({
        storeId:"gridLineIncidentsStore",
        fields : ['ID','INCIDENT_NAME','CRAFT_NAME','DATE','TIME','POSITION_DEVICE_ID','CRAFT_TYPE_ID','SEARCH_FACTOR_ID','DEAD_RECKONING','INCIDENT_ROUTE'],
        autoload:false,
        proxy: {
        type: 'ajax',
        url: urlReq,
        reader: {
            type: 'json',
            root: ''
        }
    }
});

 gridLineIncidentsStore.load();
    
 var gridLineIncidents = Ext.create('Ext.grid.Panel', {
                    title: 'Line Datum Simulation Incidents',
                    store:Ext.data.StoreManager.lookup('gridLineIncidentsStore'),
                    id:"grgPanel",
                    columns: [
                       { text: 'ID', dataIndex: 'INCIDENT_NAME',hidden:true},
                       { text: 'INCIDENT_NAME', dataIndex: 'INCIDENT_NAME'},                                                     
                       { text: 'CRAFT', dataIndex: 'CRAFT_NAME'},
                       { text: 'DATE', dataIndex: 'DATE'},
                       { text: 'TIME', dataIndex: 'TIME'},
                       { text: 'POSITION_DEVICE_ID', dataIndex: 'POSITION_DEVICE_ID',hidden:true},
                       { text: 'CRAFT_TYPE_ID', dataIndex: 'CRAFT_TYPE_ID',hidden:true},
                       { text: 'SEARCH_FACTOR_ID', dataIndex: 'SEARCH_FACTOR_ID',hidden:true},
                       { text: 'DEAD_RECKONING', dataIndex: 'DEAD_RECKONING',hidden:true},
                       { text: 'INCIDENT_ROUTE', dataIndex: 'INCIDENT_ROUTE',hidden:true}
                    ],
                    height: 400,
                    width: 400
});

    
 var previous_inci_line_datum_win = new Ext.Window({
                            id:'previous_inci_line_datum_win',
                            autoHeight :true,
                            autoWidth   : true,
                            items  : [gridLineIncidents],
                            bbar:[{
                            xtype:"button",
                                    text:"<b>Load Incident</b>",
                                    handler:function(){ 
                                          var recordIncident = gridLineIncidents.getSelectionModel().getSelection()[0].data;
                                          Ext.getCmp("previous_inci_line_datum_win").close();
                                          //console.log(recordIncident);
                                         
                                          showDatumLineWindow();
                                        
                                          Ext.getCmp("incident_name_control_line").setValue(recordIncident.INCIDENT_NAME);
                                          Ext.getCmp("missing_object_name_control_line").setValue(recordIncident.CRAFT_NAME);
                                        
                                          if(recordIncident.DATE){
                                               var incidentDate = new Date(recordIncident.DATE);
                                               Ext.getCmp("sim_date_line").setValue(incidentDate);
                                          }
                                             
                                         if(recordIncident.TIME){                                             
                                               var timeComponents = recordIncident.TIME.split(":");
                                               Ext.getCmp("sim_time_line").setValue(timeComponents[0] + ":" + timeComponents[1]);
                                          }
                                          
                                          Ext.getCmp("vessel_position_cmb_line").setValue(recordIncident.POSITION_DEVICE_ID);
                                          Ext.getCmp("vessel_type_cmb_line").setValue(recordIncident.CRAFT_TYPE_ID);
                                          Ext.getCmp("search_factor_cmb_line").setValue(recordIncident.SEARCH_FACTOR_ID);
                                        
                                          if(recordIncident.DEAD_RECKONING){
                                              Ext.getCmp("yesDRLine").setValue(true);
                                              Ext.getCmp("drDistanceLine").setValue(recordIncident.DEAD_RECKONING);
                                          }
                                         if(recordIncident.INCIDENT_ROUTE){
                                             Ext.getCmp("hiddenlinestring").setValue(recordIncident.INCIDENT_ROUTE);
                                             parseWKTGeom(recordIncident.INCIDENT_ROUTE,function(data){
                                                  Ext.getCmp("fieldSet_method_options").hide();
                                             });
                                         }
                                    }
                            }]
                        });  
    
        previous_inci_line_datum_win.show();    
}                 


function GetErrorValueUsingCraftTypeLine(){
    
    if(Ext.getCmp("vessel_position_cmb_line").getValue() !="1" && Ext.getCmp("vessel_position_cmb_line").getValue()!=null) return 0;
    
    if(isControlTypeSelected("vessel_type_cmb_line")){
         var ctl = Ext.getCmp("vessel_type_cmb_line");
        var record = ctl.findRecordByValue(ctl.getValue());
        
        return record.data.vsl_type_error;  
    }
    else{
        return 0;
    }
}




function findGridSystemUsingSearchFactorLine(){
  
    if(isControlTypeSelected("search_factor_cmb_line")){
        var ctl = Ext.getCmp("search_factor_cmb_line");
        var record = ctl.findRecordByValue(ctl.getValue());
        var gridSystemObject  = {
            grid_system: record.data.factor_grid_system,
            grid_system_size:record.data.factor_grid_system_cells
        };
        return gridSystemObject;  
    }
    else{return null;}
}



function GetErrorValueUsingDeviceTypeLine(){
    
    if(isControlTypeSelected("vessel_position_cmb_line")){
        var ctl = Ext.getCmp("vessel_position_cmb_line");
        var record = ctl.findRecordByValue(ctl.getValue());
        
        return record.data.device_error;  
    }
    else {
        
        return 0;
    }
}


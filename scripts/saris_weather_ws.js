Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
]);

var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false
});

var asw_weather_data_store =  Ext.create('Ext.data.Store', {
                                    storeId:'asw_weather_data_store',
                                    fields:['OBS_TIME','TIME_INTERVAL','NUMBER_OF_HOURS','WIND_DIRECTION','WIND_SPEED','WIND_CONTRIBUTION'],
                                    data:[{
                                            OBS_TIME: '',
                                            TIME_INTERVAL :'',
                                            NUMBER_OF_HOURS:"",
                                            WIND_DIRECTION:"",
                                            WIND_CONTRIBUTION:""
                                            },
                                            {
                                            OBS_TIME: '',
                                            TIME_INTERVAL :'',
                                            NUMBER_OF_HOURS:"",
                                            WIND_DIRECTION:"",
                                            WIND_CONTRIBUTION:""
                                            },
                                            {
                                            OBS_TIME: '',
                                            TIME_INTERVAL :'',
                                            NUMBER_OF_HOURS:"",
                                            WIND_DIRECTION:"",
                                            WIND_CONTRIBUTION:""},
                                           {
                                            OBS_TIME: '',
                                            TIME_INTERVAL :'',
                                            NUMBER_OF_HOURS:"",
                                            WIND_DIRECTION:"",
                                            WIND_CONTRIBUTION:""},
                                          {
                                           OBS_TIME: '',
                                            TIME_INTERVAL :'',
                                            NUMBER_OF_HOURS:"",
                                            WIND_DIRECTION:"",
                                            WIND_CONTRIBUTION:""}
                                         ]
    
});




var aws_weather_grid = Ext.create('Ext.grid.Panel', {
                    title: '',
                    store:Ext.data.StoreManager.lookup('asw_weather_data_store'),
                    id:"aws_weather_grid",
                    plugins: [rowEditing],
                    listeners: {
                    edit: function(obj , row) {
                        
                        var sum_total_hours = 0;
                        
                        var sum_directions = 0;
                        
                        var count_of_directions = 0;
                        
                        var sum_of_contributions = 0;
                        
                        var records =  this.getStore().getRange();
                       
                        for(var i=0;i<records.length-1;i++){
                           
                            sum_total_hours += records[i].data.NUMBER_OF_HOURS != "" ? parseFloat(records[i].data.NUMBER_OF_HOURS) : 0;
                            
                            sum_directions +=  records[i].data.WIND_DIRECTION != "" ? parseFloat( records[i].data.WIND_DIRECTION ):0;
                            
                            sum_of_contributions += records[i].data.NUMBER_OF_HOURS != ""  && records[i].data.WIND_SPEED !=""?  (parseFloat(records[i].data.NUMBER_OF_HOURS)*parseFloat(records[i].data.WIND_SPEED).toFixed(2)):0;
                            
                            if(records[i].data.WIND_DIRECTION!="")
                                count_of_directions++;
                        }
                        
                        Ext.getCmp("aws_vscT").setValue((sum_directions/count_of_directions).toFixed(2));
                        
                        Ext.getCmp("aws_total_hours").setValue(sum_total_hours);
                        
                        Ext.getCmp("aws_vscS").setValue(sum_of_contributions);
                        
                        var avg_dir = (sum_directions/count_of_directions).toFixed(2);
                        
                        Ext.getCmp("aws_avg_dir").setValue(avg_dir);
                        Ext.getCmp("search_meteo_wind_dir").setValue(avg_dir);
                        
                        debugger;
                        var downwind = parseFloat(avg_dir)>=180 ? parseFloat(avg_dir)-180 : parseFloat(avg_dir) + 180;
                       
                        Ext.getCmp("aws_avg_downwind").setValue(downwind.toFixed(2));
                        
                        var directions = GetNoEmptyDirections(records);
                        var windDiffFlag = findwindDirDiff(directions);
                        
                        
                        if(windDiffFlag)
                            Ext.getCmp("awsdve").setValue("0.5");
                        else 
                            Ext.getCmp("awsdve").setValue("0.3");
                        
                        
                        
                        //START LEEWAY CALCULATIONS
                        
                        GetLeewayData();
                        
                        //END LEEWAY CALCULATIONS
                       
                         var missed_lat = parseFloat(Ext.getCmp("txt_missed_lat").getValue());
                        
                         var missed_lon = parseFloat(Ext.getCmp("txt_missed_lon").getValue());
                        
                         //START DIVERGENCE DISTANCE, RIGHT, LEFT POSITIONS
                        
                         var missed_projected =  new OpenLayers.Geometry.Point(missed_lon,missed_lat).transform("EPSG:4326","EPSG:900913");
                         
                         var leftDirLeewayNum = parseFloat(Ext.getCmp("leeway_left_dir").getValue());
                         var rightDirLeewayNum = parseFloat(Ext.getCmp("leeway_right_dir").getValue());
                        
                         var leeway_speed = FindLeewaySpeed(parseFloat(Ext.getCmp("aws_avg_speed").getValue()));
                        
                        var distanceFromKnots = leeway_speed * 1852 * parseFloat(Ext.getCmp("drift_interval").getValue());
                       
                        var TWC_speed = parseFloat(Ext.getCmp("seacurrent_speed").getValue());
                        var TWC_direction = parseFloat(Ext.getCmp("seacurrent_direction").getValue());
                       
                        var surface_total_drift =CalculateTotalSurfaceDrift(TWC_speed,TWC_direction,leeway_speed,leftDirLeewayNum,leeway_speed,rightDirLeewayNum);
                        //CalculateDivergPositions(missed_projected.x,missed_projected.y,distanceFromKnots,leftDirLeewayNum,distanceFromKnots,rightDirLeewayNum);
                        CalculateDivergPositions(missed_projected.x,missed_projected.y,surface_total_drift.drift_left_distance,surface_total_drift.drift_left_angle,surface_total_drift.drift_right_distance,surface_total_drift.drift_right_angle);
                        
                        //END DIVERGENCE DISTANCE, RIGHT, LEFT POSITIONS
                        
                         //START Q8 CALCULATIONS
                        
                        var total_probable_drift_errorCalc = parseFloat(Ext.getCmp("drift_interval").getValue()) *parseFloat(Ext.getCmp("pdve").getValue());
                        
                        Ext.getCmp("total_probable_drift_error").setValue(total_probable_drift_errorCalc);
                        
                        var probable_initial_positionErrorCalc= CalculateMisObjectPosError();
                        
                         var probable_search_obj_positionError =0.1; //0.1 NM TO DO
                         
                       
                        
                         var sumOfSquaredErrors = Math.pow((total_probable_drift_errorCalc),2) + Math.pow((probable_initial_positionErrorCalc/1852),2) +
                              Math.pow(probable_search_obj_positionError,2);
                        
                         Ext.getCmp("total_probable_pos_error_squared").setValue(sumOfSquaredErrors.toFixed(2));
                        
                       
                         var totalProbableErrorOfPosition = Math.sqrt(sumOfSquaredErrors);
                         Ext.getCmp("total_probable_pos_error").setValue(totalProbableErrorOfPosition.toFixed(2));
                        
                         var separationRationCalc = (parseFloat(Ext.getCmp("diverg_pos_div_distance").getValue()))/totalProbableErrorOfPosition;
                         Ext.getCmp("separation_ratio").setValue(separationRationCalc.toFixed(2));
                        
                        //END Q8 CALCULATIONS
                      }
                    },  
                    bbar:[{
                            xtype:"button",
                            text:"Add",
                            handler:function(){                        
                                        asw_weather_data_store.add({                                                     
                                                            OBS_TIME: '',
                                                            TIME_INTERVAL :'',
                                                            NUMBER_OF_HOURS:"",
                                                            WIND_DIRECTION:"",
                                                            WIND_CONTRIBUTION:""
                                                      });
                                }
                          },
                          {
                            xtype:"button",
                            text:"Delete",
                            handler:function(){                        
                                        var selection = aws_weather_grid.getSelectionModel().getSelection();
                                        aws_weather_grid.remove(selection); // all selections
                                }
                          }
                    ],
                    columns: [
                       { text: 'OBS_TIME', dataIndex: 'OBS_TIME', editor: {allowBlank: true}},
                       { text: 'INTERVAL', dataIndex: 'TIME_INTERVAL',editor: {allowBlank: true}},      
                       { text: 'HOURS', dataIndex: 'NUMBER_OF_HOURS',editor: {allowBlank: true}},
                       { text: 'DIRECTION', dataIndex: 'WIND_DIRECTION',editor: {allowBlank: true}},
                       { text: 'SPEED', dataIndex: 'WIND_SPEED',editor: {allowBlank: true}},
                       { text: 'CONTRIBUTION', dataIndex: 'WIND_CONTRIBUTION',renderer:
                            function(value,metadata,record){
                                if(record.get('NUMBER_OF_HOURS')!="" && record.get('WIND_SPEED')!=""){
                                
                                return (parseFloat(record.get('NUMBER_OF_HOURS'))*parseFloat(record.get('WIND_SPEED'))).toFixed(2);
                                }
                            }
                       }
                    ]
                    
                });


function SetValueToASWFD(){
    var totalhoursValue = Ext.getCmp("aws_total_hours").getValue()!=""? parseFloat(Ext.getCmp("aws_total_hours").getValue()):0;
    var aws_vscSValue = Ext.getCmp("aws_vscS").getValue()!=""? parseFloat(Ext.getCmp("aws_vscS").getValue()):0;
    if(totalhoursValue>0 && aws_vscSValue>=0){
        Ext.getCmp("aws_avg_speed").setValue((aws_vscSValue/totalhoursValue).toFixed(2));
        Ext.getCmp("search_meteo_wind_speed").setValue((aws_vscSValue/totalhoursValue).toFixed(2));
    }
}

var aws_total_hours = {
    xtype:"textfield",
    id:"aws_total_hours",
    name:"aws_total_hours",
    fieldLabel:"Total Hours",
    listeners:{
        change:function(){
           // SetValueToASWFD();
        }
    }
};

var aws_vscT = {
    xtype:"textfield",
    id:"aws_vscT",
    name:"aws_vscT",
    fieldLabel:"Sum of (E)",   
    
};

var aws_vscS = {
    xtype:"textfield",
    id:"aws_vscS",
    name:"aws_vscS",
    fieldLabel:"Sum of (F)",
    listeners:{
        change:function(){
            SetValueToASWFD();
        }
    }
};



var aws_weather_grid_totals = {
                xtype:"panel",
                layout: {
                type: 'hbox',
                align: 'strech'
                },
                style:"margin:5px",
                defaults: {
                    flex: 1,                  
                },
                items:[aws_total_hours,aws_vscT,aws_vscS]
};



var average_surface_weather_tab ={
     title:"Average Surface Weather",
     id:"average_surface_weather_tab",
     items:[ {xtype       : 'form',
        height   : 480,
        autoWidth   : true,
        autoScroll  : true,
        id          : 'average_surface_weather_form_panel',
        layout:'anchor',
        defaultType : 'field',
        frame       : true,
        items:[aws_weather_grid,aws_weather_grid_totals,aws_avg_dir,aws_avg_downwind,aws_avg_speed,leeway_left_dir,leeway_right_dir,pdve,awse,awsdve,sea_current_direction,sea_current_speed,sea_current_prob_error,diverg_pos_lat_left_downwind,diverg_pos_lon_left_downwind,diverg_pos_lat_right_downwind,diverg_pos_lon_right_downwind,diverg_pos_div_distance,total_probable_drift_error,total_probable_pos_error_squared,total_probable_pos_error,separation_ratio]}      
        //aws_avg_sur_wind,
        //aws_probable_error,
        //leeway_calculations
        ]
};

function GetNoEmptyDirections(rows){
  var directions = [];
    
  for(var i = 0;i<rows.length;i++){ 
    if(rows[i].data.WIND_DIRECTION!="")
        directions.push(parseFloat(rows[i].data.WIND_DIRECTION));
  }
    return directions;
}
function findwindDirDiff(rows){
   
    rows.sort(function(a,b){
      return a-b; 
    });
    
    var maxDifference = Math.abs(rows[0] - rows[rows.length-1]);
    
    if(maxDifference>=90)
        return true
    else
        return false;   
}
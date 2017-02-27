


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
                                    }
                                    ]
                            };


var method_options_control= {
                                xtype: 'fieldset',
                                flex: 1,
                                title: '<b>Point Method Initialisation</b>',
                                defaultType: 'button', // each item will be a checkbox
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%',
                                    hideEmptyLabel: false
                                },
                                style:'padding:20px',
                                items:[{
                                        xtype: 'button',
                                        name: 'txt-test1',
                                        text: 'Clik on map',
                                        handler:function(){
                                                    clickCtl.callback_fn=function(latlon){ 
                                                        
                                                    var pointFromMap = latlon.transform("EPSG:3857", "EPSG:4326");
                                                    var clickLat = pointFromMap.lat;
                                                    var clickLon = pointFromMap.lon;
                                                        
                                                    Ext.getCmp("missed_object_coords_control").show();
                                                    Ext.getCmp("txt_missed_lat").setValue(clickLat.toFixed(5));
                                                    Ext.getCmp("txt_missed_lon").setValue(clickLon.toFixed(5));                                   this.deactivate();          
                                                }
                                                    
                                                clickCtl.activate();                                              
                                            }                                    
                                        },
                                        {
                                            xtype: 'button',
                                            name: 'use_coords_btn',
                                            text: 'Use coordinates',
                                            handler:function(){
                                                showCoordsPanel(true);
                                            }
                                    }]
                            };

var dr_options_control = {
                            xtype: 'fieldcontainer',
                            labelWidth: 100,
                            layout: 'hbox',
                            items: [{
                                        xtype: 'label',
                                        text: 'Dead Reckoning:',
                                    },
                                    {
                                        xtype: 'radio',
                                        id: 'yesDR',
                                        name: 'rbGroup',
                                        checked: false,
                                        hideLabel: false,
                                        labelSeparator: '',
                                        hideLabel: true,
                                        boxLabel: 'Yes',
                                        fieldLabel: 'Yes',
                                        style: 'margin-left: 10px',
                                        handler:function(){
                                            var drD = Ext.getCmp("drDistance");
                                            drD.setValue(null);
                                            drD.hide();
                                        }
                                    }, 
                                    {
                                       xtype:"textfield",
                                       id:"drDistance",
                                       name:"drDistance",
                                       hidden : true,
                                       style:"margin-left:5px",
                                       "emptyText":"DR in Nautical Miles"
                                    },
                                    {
                                        xtype: 'radio',
                                        text:'No',
                                        id: 'noDR',
                                        name: 'rbGroup',
                                        checked: true,
                                        hideLabel: true,
                                        boxLabel: 'No',
                                        fieldLabel: 'No',
                                        style: 'margin-left: 10px',
                                        handler:function(){
                                            var drD = Ext.getCmp("drDistance");
                                            drD.setValue(null);
                                            drD.show();
                                        }
                                    }                                
                                   ]
                          };



var search_factor_cmb = {
                                xtype: 'combo',
                                width:400,
                                id:"search_factor_cmb",
                                fieldLabel: 'Search_Factor',
                                hiddenName: 'searchFactor',
                                store: new Ext.data.SimpleStore({
                                    data:search_factor_ds,         
                                    id: 0,
                                    fields: ['factor_id','factor_value','factor_grid_system','factor_grid_system_cells']
                                }),
                                valueField: 'factor_id',
                                displayField: 'factor_value',
                                triggerAction: 'all',
    
}

var vessel_device_type_cmb =  {
                                xtype: 'combo',
                                width:400,
                                id:"vessel_position_cmb",
                                fieldLabel: 'Select Device',
                                hiddenName: 'deviceType',
                                store: new Ext.data.SimpleStore({
                                    data: vessel_position_devices_ds,
                                    id: 0,
                                    fields: ['device_id','device_error', 'device_type']
                                }),
                                valueField: 'device_id',
                                displayField: 'device_type',
                                triggerAction: 'all',
                                listeners:{
                                    select:function(combo, record){
                                        /*
                                        var vslTypeCmb = Ext.getCmp("vessel_type_cmb");
                                        var selectedDevice = record[0].data.device_type;
                                        
                                        if(selectedDevice=="Uknown")
                                            vslTypeCmb.setDisabled(false);
                                        else
                                            vslTypeCmb.setDisabled(true);
                                            */
                                      
                                      
                                        //if(combo.getValue())
                                        //
                                        //vslTypeCmb.setEnabled(true);
                                    }
                                }
                            };

var vessel_vessel_type = {
                            xtype: 'combo',
                            width:400,
                            id:"vessel_type_cmb",
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


var vessel_subtype = {
                        xtype: 'combo',
                        width:400,
                        id:"vessel_subtype",
                        fieldLabel: 'Select Craft Sub Type',
                        hiddenName: 'craftSubType',
                        store: new Ext.data.SimpleStore({
                            data:vessel_sub_types_ds,
                            id: 0,
                            fields: ['vsl_subtype_id','GENERAL_TYPE','vsl_subtype_name','vsl_subtype_leeway_angle','vsl_subtype_leeway_errorKnots','vsl_case']
                        }),

                        valueField: 'vsl_subtype_id',
                        displayField: 'vsl_subtype_name',
                        triggerAction: 'all',
                        listeners:{
                            change:function(combo){
                              value = combo.getValue();
                              record = combo.findRecordByValue(value);
                                
                              if(record.data.GENERAL_TYPE == "RAFT"){
                                  Ext.getCmp("persons_raft").show();
                                  Ext.getCmp('vessel_length').setDisabled(true); 
                              }
                              else{
                                    Ext.getCmp("persons_raft").hide();
                                     Ext.getCmp('vessel_length').setDisabled(false); 
                              }
                                
                                GetLeewayData();
                            }
                        }
                };

var vessel_length = {
    xtype:"textfield",
    id:"vessel_length",
    name:"vessel_length",
    fieldLabel:"Craft Length",
    width:400
};

var persons_raft = {
    xtype:"textfield",
    hidden:true,
    id:"persons_raft",
    name:"persons_raft",
    fieldLabel:"Persons",
    width:400
};

var incident_name_control = {
    xtype:"textfield",
    id:"incident_name_control",
    name:"incident_name_control",
    fieldLabel:"Incident Name",
    width:400
};

var missing_object_name_control = {
    xtype:"textfield",
    id:"missing_object_name_control",
    name:"missing_object_name_control",
    fieldLabel:"Missing Object Name",
    width:400
};


var leftsidePanel =         {
                            xtype: 'fieldset',
                            flex: 1,
                            title: '<b>Input Data</b>',
                            layout: 'anchor',
                            defaults: {
                            anchor: '100%',
                            hideEmptyLabel: false
                                },
                            items:[incident_name_control,missing_object_name_control,vessel_device_type_cmb,vessel_vessel_type,vessel_subtype,persons_raft,vessel_length,search_factor_cmb,dr_options_control,method_options_control,missed_object_coords_control]
                            }
    
var rightPanel = {
                           xtype: 'fieldset',
                                flex: 1,
                                title: '<b>Meterological Data</b>',
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%',
                                    hideEmptyLabel: false
                                },
                                style:'margin-left:10px',
                                
                            items:[{
                                    xtype:"textfield",
                                    id:"meteo_wind_speed",
                                    name:"meteo_wind_speed",
                                    fieldLabel:"Wind Speed",
                                    width:400
                            },
                                  {
                                    xtype:"textfield",
                                    id:"meteo_wind_direction",
                                    name:"meteo_wind_direction",
                                    fieldLabel:"Wind Direction",
                                    width:400
                            },
                                  ]
                            };

var point_datum_form_panel = {
                                xtype       : 'form',
                                autoHeight   : true,
                                autoWidth   : true,
                                autoScroll  : true,
                                id          : 'point_datum_form_panel',
                                defaultType : 'field',
                                frame       : true,
                                //layout:"hbox",
                                title       : 'Incident',
                                items       :[leftsidePanel],
                                buttons:[
                                    {
                                        xtype:"button",
                                        text:"Simulate",
                                        handler:function(){
                                            var incident_Error_Layer_Name = "Position Error : " + Ext.getCmp("incident_name_control").getValue();
                                            var incident_grid_Layer_Name = "Point Datum Grid : " + Ext.getCmp("incident_name_control").getValue();
                                            var vectorLayer = new OpenLayers.Layer.Vector(incident_Error_Layer_Name);
                                            var lat = Ext.getCmp("txt_missed_lat").getValue();
                                            var lon = Ext.getCmp("txt_missed_lon").getValue();
                                            
                                            var tPoint =new OpenLayers.LonLat(lon,lat).transform( "EPSG:4326", "EPSG:900913");
                                          
                                            var point = new OpenLayers.Geometry.Point(tPoint.lon, tPoint.lat);
                                            
                                            var devicePositionError = GetErrorValueUsingDeviceType() * 1852;
                                              
                                            var vesselTypeError = GetErrorValueUsingCraftType() * 1852;
                                            
                                            var drError = GetErrorBasedOnDR();
                                            
                                            console.log([devicePositionError,vesselTypeError,drError]);
                                            
                                            var totalPositionError = devicePositionError + vesselTypeError + drError;
                                            
                                            console.log( "Total Position Error:" + totalPositionError);
                                            
                                            var  gridSystemInfo = findGridSystemUsingSearchFactor();                                           
                                            
                                            var cellSizeFactor = findGridUnitWidthFactor(gridSystemInfo.grid_system);
                                                                                       
                                            var unitCellFixedWidth = totalPositionError * cellSizeFactor;
                                            
                                            
                                            var Ulx = CalculateGridULx(tPoint.lon,gridSystemInfo.grid_system_size,unitCellFixedWidth);
                                            var ULy = CalculateGridULy(tPoint.lat,gridSystemInfo.grid_system_size,unitCellFixedWidth);
                                            
                                            var LRx = CalculateGridLRx(tPoint.lon,gridSystemInfo.grid_system_size,unitCellFixedWidth);
                                            var LRy = CalculateGridLRy(tPoint.lat,gridSystemInfo.grid_system_size,unitCellFixedWidth);
                                            
                                            
                                            var URx = CalculateGridURx(tPoint.lon,gridSystemInfo.grid_system_size,unitCellFixedWidth);
                                            var URy = CalculateGridURy(tPoint.lat,gridSystemInfo.grid_system_size,unitCellFixedWidth);
                                                                                   
                                            
                                            var pointUL = new OpenLayers.Geometry.Point(Ulx, ULy);
                                            var pointLR = new OpenLayers.Geometry.Point(LRx, LRy);
                                            var pointUR = new OpenLayers.Geometry.Point(URx, URy);
                                            
                                            var sendObj = {
                                                    simulation_type:"POINT_DATUM",
                                                    simulation_data:{
                                                    lat:tPoint.lat,
                                                    lon:tPoint.lon,
                                                    radius:totalPositionError,
                                                    side:unitCellFixedWidth,
                                                    grid_size:gridSystemInfo.grid_system_size,
                                                    grid_ULx:Ulx,
                                                    grid_ULy:ULy,
                                                    grid_LRx:LRx,
                                                    grid_LRy:LRy
                                                }
                                            };
                                            
                                           console.log(sendObj);
                                            
                                            SendRequestToGProcess("http://localhost:81/Saris/servlets_proxy.php","Simulation",sendObj,function(data){
                                                   var geometryString = data.responseData;
                                                
                                                   pointDatumResultProcessing(geometryString,incident_grid_Layer_Name);
                                                   
                                                    var mycircle = OpenLayers.Geometry.Polygon.createRegularPolygon
                                                    (
                                                        point,
                                                        totalPositionError,
                                                        40,
                                                        0
                                                    );

                                                    var grid_unit = mycircle.getBounds().toGeometry();

                                                    var grid_unit_feature =  new OpenLayers.Feature.Vector(grid_unit);

                                                    var featurecircle = new OpenLayers.Feature.Vector(mycircle);

                                                    var titleForPoint = Ext.getCmp("incident_name_control").getValue();

                                                    var styleForPoint = new  SarisLabelPointStyle(titleForPoint);
                                                    styleForPoint.fillColor= "#000000";

                                                    var featurePoint = new OpenLayers.Feature.Vector(
                                                        point,
                                                        null,
                                                       styleForPoint
                                                    );

                                                     var styleForPoint2 = new  SarisLabelPointStyle("UL POINT");
                                                    styleForPoint.fillColor= "#000000";

                                                    var featurePointUL =  new OpenLayers.Feature.Vector(
                                                        pointUL,
                                                        null,
                                                        styleForPoint2
                                                    ); 


                                                     var styleForPoint3 = new  SarisLabelPointStyle("LR POINT");
                                                    styleForPoint.fillColor= "#000000";

                                                    var featurePointLR =  new OpenLayers.Feature.Vector(
                                                        pointLR,
                                                        null,
                                                        styleForPoint3
                                                    ); 

                                                     var styleForPoint4 = new  SarisLabelPointStyle("UR POINT");
                                                     styleForPoint.fillColor= "#000000";

                                                    var featurePointUR =  new OpenLayers.Feature.Vector(
                                                        pointUR,
                                                        null,
                                                        styleForPoint4
                                                    ); 

                                                    vectorLayer.addFeatures([ featurecircle,featurePoint,featurePointUL,featurePointLR,featurePointUR]);

                                                   
                                                    map.addLayer(vectorLayer);

                                                    map.setCenter(tPoint,8);    
                                                 
                                                    var layerSimStoreCircle =  {
                                                            title:incident_Error_Layer_Name,
                                                            name:incident_Error_Layer_Name,
                                                            bbox:vectorLayer.getDataExtent(),
                                                            serviceUrl:"",
                                                            serviceName:"",
                                                            serviceType:"SVS",
                                                            serviceServerType: "",
                                                            legendImage:""
                                                        };
                                                
                                                    map_simulation_layers_store.push(layerSimStoreCircle);
                                                    
                                                   AddLayerToTree(vectorLayer,layerSimStoreCircle);
                                               }
                                            );
                                            
                                           // CreateTest();
                                        }
                                    },
                                    {
                                        xtype:"button",
                                        text:"Save Insident",
                                        handler:function(){
                                        
                                        var incident={                                          
                                                TASK:"INSERT",
                                                ENTITY:"saris_simulations",
                                                VALUES:{
                                                     INCIDENT_NAME:Ext.getCmp("incident_name_control").getValue()!=""?Ext.getCmp("incident_name_control").getValue():null,
                                                     CRAFT_NAME:Ext.getCmp("missing_object_name_control").getValue()!=null?Ext.getCmp("missing_object_name_control").getValue():null,
                                                     DATE:Ext.getCmp("sim_date").getValue(),
                                                     TIME:TimeToString(Ext.getCmp("sim_time").getValue()),
                                                     POSITION_DEVICE_ID:Ext.getCmp("vessel_position_cmb").getValue(),
                                                     CRAFT_TYPE_ID:Ext.getCmp("vessel_type_cmb").getValue(),
                                                     SEARCH_FACTOR_ID:Ext.getCmp("search_factor_cmb").getValue(),
                                                     DEAD_RECKONING:Ext.getCmp("drDistance").getValue() != null?parseFloat(Ext.getCmp("drDistance").getValue()):null,
                                                     INCIDENT_LATITUDE:Ext.getCmp("txt_missed_lat").getValue() != null ?parseFloat(Ext.getCmp("txt_missed_lat").getValue()):null,
                                                     INCIDENT_LONGITUDE: Ext.getCmp("txt_missed_lon").getValue() != null ?parseFloat(Ext.getCmp("txt_missed_lon").getValue()):null     
                                                }
                                        };
                                        
                                        SendRequestToGProcess("http://localhost:81/Saris/servlets_proxy.php","DataDb",incident,function(data){
                                                   
                                                    //TO DO PROCESS REQUEST FROM GEOMETRY SERVICES
                                                    Ext.Msg.alert(data.Result, data.Data);
                                        
                                                }
                                            );
                                    
                                        }
                                    }
                                    
                                ]
                            };


var asw_tab ={
     title:"Average Surface Weather",
     id:"asw_tab",
     items:[
         {
          xtype: 'form',
          frame:true,
          height:530,
          items:[{
            xtype: 'fieldset',
            flex: 1,         
            title: '<b>A1.Surface Wind Data</b>',
            layout: 'fit',
            items:[aws_weather_grid,aws_weather_grid_totals]
         },         
        aws_avg_sur_wind,
        aws_probable_error,
        leeway_calculations
        ]
}]};


var seacurrents_tab ={
     title:"Water Current",
     id:"seacurrents_tab",
     items:[
         {
          xtype: 'form',
          frame:true,
          items:[sea_current_info]
         }
        ]
};



var point_search_facilities_tab_items ={
                                xtype       : 'form',
                                autoHeight   : true,
                                autoWidth   : true,
                                autoScroll  : true,
                                layout:'fit',
                                id          : 'point_search_facilities_tab_items',
                                defaultType : 'field',
                                frame       : true,
                                items:[]
                            };



var point_datum_tabs = {
                        xtype:"tabpanel",
                        region: 'center',
                        activeTab: 0,
                        width:700,
                        height: 560,
                        id:"point_datum_tabpanel",
                        items:[ point_datum_form_panel,
                               datum_drift_tab,                            
                               asw_tab,
                               search_facilities_tab,
                               seacurrents_tab,
                               position_diverg,
                               total_effort_allocation_tab]
};


function showDatumPointWindow(){

        var point_datum_win = new Ext.Window({
                                id:'point_datum_window',
                                autoHeight :true,
                                autoWidth   : true,
                                items  : [point_datum_tabs]
        });
    
        point_datum_win.show();
}






function LoadSavedIncidents(){
       
   var reqObj={
         TASK:"SELECT",
         ENTITY:"saris_simulations",
         VALUES:{}
   };

  
  var urlReq = "http://localhost:81/Saris/servlets_proxy.php?servlet=DataDb&data=" + Ext.JSON.encode(reqObj);
    
    
  var gridPointIncidentsStore = new Ext.data.JsonStore({
        storeId:"gridPointIncidentsStore",
        fields : ['ID','INCIDENT_NAME','CRAFT_NAME','DATE','TIME','POSITION_DEVICE_ID','CRAFT_TYPE_ID','SEARCH_FACTOR_ID','DEAD_RECKONING','INCIDENT_LATITUDE','INCIDENT_LONGITUDE'],
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

 gridPointIncidentsStore.load();
    
 var gridPointIncidents = Ext.create('Ext.grid.Panel', {
                    title: 'Point Datum Simulation Incidents',
                    store:Ext.data.StoreManager.lookup('gridPointIncidentsStore'),
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
                       { text: 'INCIDENT_LATITUDE', dataIndex: 'INCIDENT_LATITUDE',hidden:true},
                       { text: 'INCIDENT_LONGITUDE', dataIndex: 'INCIDENT_LONGITUDE',hidden:true},
                    ],
                    height: 400,
                    width: 400
                    
                });


    
    
 var previous_inci_point_datum_win = new Ext.Window({
                            id:'previous_inci_point_datum_win',
                            autoHeight :true,
                            autoWidth   : true,
                            layout:fit,
                            items  : [gridPointIncidents],
                            
                            bbar:[{
                            xtype:"button",
                                    text:"<b>Load Incident</b>",
                                    handler:function(){ 
                                          var recordIncident = gridPointIncidents.getSelectionModel().getSelection()[0].data;
                                          Ext.getCmp("previous_inci_point_datum_win").close();
                                          //console.log(recordIncident);
                                         
                                          showDatumPointWindow();
                                        
                                          Ext.getCmp("incident_name_control").setValue(recordIncident.INCIDENT_NAME);
                                          Ext.getCmp("missing_object_name_control").setValue(recordIncident.CRAFT_NAME);
                                        
                                          if(recordIncident.DATE){
                                               var incidentDate = new Date(recordIncident.DATE);
                                               Ext.getCmp("sim_date").setValue(incidentDate);
                                          }
                                             
                                         if(recordIncident.TIME){                                             
                                               var timeComponents = recordIncident.TIME.split(":");
                                               Ext.getCmp("sim_time").setValue(timeComponents[0] + ":" + timeComponents[1]);
                                          }
                                          
                                          Ext.getCmp("vessel_position_cmb").setValue(recordIncident.POSITION_DEVICE_ID);
                                          Ext.getCmp("vessel_type_cmb").setValue(recordIncident.CRAFT_TYPE_ID);
                                          Ext.getCmp("search_factor_cmb").setValue(recordIncident.SEARCH_FACTOR_ID);
                                        
                                          if(recordIncident.DEAD_RECKONING){
                                              Ext.getCmp("yesDR").setValue(true);
                                              Ext.getCmp("drDistance").setValue(recordIncident.DEAD_RECKONING);
                                          }
                                        
                                          if(recordIncident.INCIDENT_LATITUDE && recordIncident.INCIDENT_LONGITUDE){
                                              var coordsPanel = Ext.getCmp("missed_object_coords_control");
                                              coordsPanel.show()
    
                                              Ext.getCmp("txt_missed_lat").setValue(recordIncident.INCIDENT_LATITUDE);
                                              Ext.getCmp("txt_missed_lon").setValue(recordIncident.INCIDENT_LONGITUDE);  
                                          }                                         
                                    }
                            }]
                        });  
    
        previous_inci_point_datum_win.show();    
}                 



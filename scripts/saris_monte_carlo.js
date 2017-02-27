var mc_incident_name_control = {
    xtype:"textfield",
    id:"mc_incident_name_control",
    name:"mc_incident_name_control",
    fieldLabel:"Incident Name",
    width:400
};

var mc_missing_object_name_control = {
    xtype:"textfield",
    id:"mc_missing_object_name_control",
    name:"mc_missing_object_name_control",
    fieldLabel:"Missing Object Name",
    width:400
};

var mc_incident_date = {
    xtype:"datefield",
    format: 'd/m/Y',
    id:"mc_sim_date",
    name:"mc_sim_date",
    fieldLabel:"Date",
    width:400
};
var mc_incident_time = {
    xtype:"timefield",
    id:"mc_sim_time",
    name:"mc_sim_time",
    fieldLabel:"Time",
    format : 'H:i',
    width:400
};

mc_incident_date,mc_incident_time,mc_sim_incident_date,mc_sim_incident_time

var mc_sim_incident_date = {
    xtype:"datefield",
    format: 'd/m/Y',
    id:"mc_sim_incident_date",
    name:"mc_sim_incident_date",
    fieldLabel:"Date",
    width:400
};
var mc_sim_incident_time = {
    xtype:"timefield",
    id:"mc_sim_incident_time",
    name:"mc_sim_incident_time",
    fieldLabel:"Time",
    format : 'H:i',
    width:400
};

var mc_simulation_vars = [mc_sim_incident_date,mc_sim_incident_time,{
        xtype:"textfield",
        id:"mc_position_lat",
        name:"mc_position_lat",
        fieldLabel:"Latitude",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_position_lon",
        name:"mc_position_lon",
        fieldLabel:"Longitude",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_position_lat_left_datum",
        name:"mc_position_lat_left_datum",
        fieldLabel:"Left Datum Lat",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_position_lon_left_datum",
        name:"mc_position_lon_left_datum",
        fieldLabel:"Left Datum Lon",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_position_lat_right_datum",
        name:"mc_position_lat_right_datum",
        fieldLabel:"Right Datum Lat",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_position_lon_right_datum",
        name:"mc_position_lon_right_datum",
        fieldLabel:"Right Datum Lon",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_wind_speed",
        name:"mc_wind_speed",
        fieldLabel:"Wind Speed",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_wind_direction",
        name:"mc_wind_direction",
        fieldLabel:"Wind Direction",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_sea_current_speed",
        name:"mc_sea_current_speed",
        fieldLabel:"Sea Currents Speed",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_sea_current_direction",
        name:"mc_sea_current_direction",
        fieldLabel:"Sea Currents Direction",
        width:400
    },
    {
        xtype:"textfield",
        id:"mc_seed",
        name:"mc_seed",
        fieldLabel:"Seed Number",
        width:400,
        value:'1000'
    }];


var mc_sim_vars_fieldset = {
                        xtype: 'fieldset',
                        flex: 1,
                        title: '<b>Input Simulation Data</b>',
                        layout: 'anchor',
                        defaults: {
                        anchor: '100%',
                        hideEmptyLabel: false,
                        },
                        items:mc_simulation_vars
                     };



var monte_carlo_items = [mc_incident_name_control,mc_missing_object_name_control,mc_incident_date,mc_incident_time,mc_sim_vars_fieldset];



var monte_carlo_form ={
                        xtype       : 'form',
                        autoHeight   : true,
                        autoWidth   : true,
                        autoScroll  : true,
                        id          : 'monte_carlo_form_panel',
                        defaultType : 'field',
                        frame       : true,
                        title       : 'Monte Carlo Simulation',
                        items       :monte_carlo_items,
                        buttons:[
                            {
                                xtype:"button",
                                text:"Simulate",
                                handler:function(){monteCarloSimProcess();}
                            },
                            {
                                xtype:"button",
                                text:"Save"
                            }]
                    };

function showMonteCarloWindow(){
        var monteCarlo_win = new Ext.Window({
                                id:'monteCarlo_win',
                                autoHeight :true,
                                autoWidth  :true,
                                items  : [monte_carlo_form]
        });
    
        monteCarlo_win.show();
}

function monteCarloSimProcess(){
    
    var  pointlat = parseFloat(Ext.getCmp("mc_position_lat").getValue());
    var  pointlon = parseFloat(Ext.getCmp("mc_position_lon").getValue());
    
    var leftpointlat = parseFloat(Ext.getCmp("mc_position_lon_left_datum").getValue());
    var leftpointlon = parseFloat(Ext.getCmp("mc_position_lat_left_datum").getValue());
    var datum_point_left  = new OpenLayers.LonLat(leftpointlon,leftpointlat).transform("EPSG:4326", "EPSG:900913");
    
    var rightpointlat = parseFloat(Ext.getCmp("mc_position_lat_right_datum").getValue());
    var rightpointlon = parseFloat(Ext.getCmp("mc_position_lon_right_datum").getValue());
    var datum_point_right  = new OpenLayers.LonLat(rightpointlon,rightpointlat).transform("EPSG:4326", "EPSG:900913");
    
    var  points_seed = parseFloat(Ext.getCmp("mc_seed").getValue());
    
    var  wind_speed = Ext.getCmp("mc_wind_speed").getValue()!=null? parseFloat(Ext.getCmp("mc_wind_speed").getValue()):0;
    var  wind_dir = Ext.getCmp("mc_wind_direction").getValue()!=null?parseFloat(Ext.getCmp("mc_wind_direction").getValue()):0;
  
    var  sea_cur_speed = Ext.getCmp("mc_sea_current_speed").getValue()!=null?parseFloat(Ext.getCmp("mc_sea_current_speed").getValue()):0;
    var  sea_cur_dir = Ext.getCmp("mc_sea_current_direction").getValue()?parseFloat(Ext.getCmp("mc_sea_current_direction").getValue()):0;
    
    var inc_point =new OpenLayers.LonLat(pointlon,pointlat).transform("EPSG:4326", "EPSG:900913");
    console.log(inc_point);                       
    var point = new OpenLayers.Geometry.Point(pointlon, pointlat);
    
    var elapsedTime = CalculateHoursDiffGeneric(Ext.getCmp("mc_sim_date").getValue(),Ext.getCmp("mc_sim_time").getValue(),Ext.getCmp("mc_sim_incident_date").getValue(),Ext.getCmp("mc_sim_incident_time").getValue());
    
    var simRequest = {
         simulation_type:"MONTE_CARLO",
         simulation_data:{ 
              X:inc_point.lon,
              Y:inc_point.lat,
              seed:points_seed,
              wind_speed:wind_speed,
              wind_dir:wind_dir,
              sea_cur_speed:sea_cur_speed,
              sea_cur_dir:sea_cur_dir,
              hours:elapsedTime
         }
    };
    
    
    
    debugger;
    
    SendRequestToGProcess(web_app_url + "/servlets_proxy.php","Simulation",simRequest,function(data){
        
        debugger;
        var layNameMC = Ext.getCmp("mc_incident_name_control").getValue() + "IP";
        
        var pointCloudVectorLayer = new OpenLayers.Layer.Vector(layNameMC);
        
        var pointsResponse = data.responseData.split('|');
              
        for(var i=0; i<pointsResponse.length-1;i++){
            
            var coords = pointsResponse[i].split(" ");
            if(coords[0] != "NaN" &&  coords[1] != "NaN")
            {
                var rec_point =  new OpenLayers.Geometry.Point(coords[0], coords[1]);
                      
                var pointCloudVector =  new OpenLayers.Feature.Vector(rec_point,null,{fillColor: 'red'});
            
                pointCloudVectorLayer.addFeatures([pointCloudVector]);
            }
            
        }
        map.addLayer(pointCloudVectorLayer);
        
        var layerSimStoreMonteCarlo =  {
                    title:layNameMC,
                    name:layNameMC,
                    bbox:pointCloudVectorLayer.getDataExtent(),
                    serviceUrl:"",
                    serviceName:"",
                    serviceType:"SVS",
                    serviceServerType: "",
                    legendImage:""
                };

    map_simulation_layers_store.push(layerSimStoreMonteCarlo);

    AddLayerToTree(pointCloudVectorLayer,layerSimStoreMonteCarlo);
        
    });
    
    
     var simRequestleft = {
         simulation_type:"MONTE_CARLO",
         simulation_data:{ 
              X:datum_point_left.lon,
              Y:datum_point_left.lat,
              seed:points_seed,
              wind_speed:wind_speed,
              wind_dir:wind_dir,
              sea_cur_speed:sea_cur_speed,
              sea_cur_dir:sea_cur_dir,
              hours:elapsedTime
         }
    };
    
    
    
    debugger;
    
    SendRequestToGProcess("http://localhost:81/Saris/servlets_proxy.php","Simulation",simRequestleft,function(data){
        
        var layNameMC = Ext.getCmp("mc_incident_name_control").getValue() + "Left Datum";
        
        var pointCloudVectorLayer = new OpenLayers.Layer.Vector(layNameMC);
        
        var pointsResponse = data.responseData.split('|');
              
        for(var i=0; i<pointsResponse.length-1;i++){
            var coords = pointsResponse[i].split(" ");
            
            if(coords[0] != "NaN" &&  coords[1] != "NaN")
            {
                var rec_point =  new OpenLayers.Geometry.Point(coords[0], coords[1]);
                      
                var pointCloudVector =  new OpenLayers.Feature.Vector(rec_point,null,{fillColor: 'red'});
            
                pointCloudVectorLayer.addFeatures([pointCloudVector]);
            }
            
        }
        map.addLayer(pointCloudVectorLayer);
        
        var layerSimStoreMonteCarlo =  {
                    title:layNameMC,
                    name:layNameMC,
                    bbox:pointCloudVectorLayer.getDataExtent(),
                    serviceUrl:"",
                    serviceName:"",
                    serviceType:"SVS",
                    serviceServerType: "",
                    legendImage:""
                };

    map_simulation_layers_store.push(layerSimStoreMonteCarlo);

    AddLayerToTree(pointCloudVectorLayer,layerSimStoreMonteCarlo);
        
    });
    
     var simRequestRight = {
         simulation_type:"MONTE_CARLO",
         simulation_data:{ 
              X:datum_point_right.lon,
              Y:datum_point_right.lat,
              seed:points_seed,
              wind_speed:wind_speed,
              wind_dir:wind_dir,
              sea_cur_speed:sea_cur_speed,
              sea_cur_dir:sea_cur_dir,
              hours:elapsedTime
         }
    };
    
    
    
    debugger;
    
    SendRequestToGProcess("http://localhost:81/Saris/servlets_proxy.php","Simulation",simRequestRight,function(data){
        
        var layNameMC = Ext.getCmp("mc_incident_name_control").getValue() + "Left Datum";
        
        var pointCloudVectorLayer = new OpenLayers.Layer.Vector(layNameMC);
        
        var pointsResponse = data.responseData.split('|');
              
        for(var i=0; i<pointsResponse.length-1;i++){
            var coords = pointsResponse[i].split(" ");
            
            var rec_point =  new OpenLayers.Geometry.Point(coords[0], coords[1]);
                      
            var pointCloudVector =  new OpenLayers.Feature.Vector(rec_point,null,{fillColor: 'blue'});
            
            pointCloudVectorLayer.addFeatures([pointCloudVector]);
            
        }
        map.addLayer(pointCloudVectorLayer);
        
        var layerSimStoreMonteCarlo =  {
                    title:layNameMC,
                    name:layNameMC,
                    bbox:pointCloudVectorLayer.getDataExtent(),
                    serviceUrl:"",
                    serviceName:"",
                    serviceType:"SVS",
                    serviceServerType: "",
                    legendImage:""
                };

    map_simulation_layers_store.push(layerSimStoreMonteCarlo);

    AddLayerToTree(pointCloudVectorLayer,layerSimStoreMonteCarlo);
        
    });
    
}
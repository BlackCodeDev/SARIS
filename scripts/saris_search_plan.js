
var search_method_options = {
        xtype: 'combobox',
        id:"search_method_options",
        triggerAction: 'all',
        lazyRender:true,
        width:400,
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: [
                'ID','METHOD'
            ],
            data: [["VS","Sector Search"],["SS","Expanding Square"],["PS","Parallel Sweep Search"],["CS","Creeping Line Search"]]
        }),
        listeners:{
            change:function(combo){
                 var selectedID = combo.findRecordByValue(combo.getValue()).data.ID;
                  
                  Ext.getCmp("search_facility_radius").setValue(null);
                  Ext.getCmp("search_facility_track_spacing").setValue(null);
                
                 if(selectedID == "VS"){
                    Ext.getCmp("search_facility_radius").show();
                    Ext.getCmp("search_facility_track_spacing").hide();
                    Ext.getCmp("search_facility_area_length").hide();
                    Ext.getCmp("search_facility_area_width").hide();
                 }
                 else if(selectedID == "PS"){
                    Ext.getCmp("search_facility_radius").hide();
                    Ext.getCmp("search_facility_track_spacing").show();
                    Ext.getCmp("search_facility_area_length").show();
                    Ext.getCmp("search_facility_area_width").show();
                    Ext.getCmp("search_datum_wind_direction").hide();
                    Ext.getCmp("search_facility_attempt").setValue(null);
                    Ext.getCmp("search_facility_attempt").hide();
                 }
                 else if(selectedID == "SS" || selectedID == "CS"){
                    Ext.getCmp("search_facility_radius").hide();
                    Ext.getCmp("search_facility_track_spacing").show();
                    Ext.getCmp("search_facility_area_length").hide();
                    Ext.getCmp("search_facility_area_width").hide();
                    Ext.getCmp("search_datum_wind_direction").show();
                 }
                else{
                    return;
                }
            }
        },
        fieldLabel:"Search Method",
        valueField: 'ID',
        displayField: 'METHOD',
};


var search_facility_area_width = {
     xtype: 'textfield',
        id:"search_facility_area_width",
        name:"search_facility_area_width",
        fieldLabel:"Area Width", 
        width:400,
        hidden:true
};


var search_facility_area_length = {
        xtype: 'textfield',
        id:"search_facility_area_length",
        name:"search_facility_area_length",
        fieldLabel:"Area Length", 
        width:400,
        hidden:true
};

var search_facility_object = {
        xtype: 'textfield',
        id:"search_facility_object",
        name:"search_facility_object",
        fieldLabel:"Search Facility", 
        width:400,
};

var search_facility_radius = {
        xtype: 'textfield',
        id:"search_facility_radius",
        name:"search_facility_radius",
        fieldLabel:"Search radius",
        hidden:true,
        width:400,

};
var search_datum_point_lat = {
        xtype: 'textfield',
        id:"search_datum_point_lat",
        name:"search_datum_point_lat",
        fieldLabel:"Datum Point Latitude",
        width:400,  

};


var search_datum_point_lon = {
        xtype: 'textfield',
        id:"search_datum_point_lon",
        name:"search_datum_point_lon",
        fieldLabel:"Datum Point Longitude",
        width:400,  

};


var search_datum_wind_direction = {
        xtype: 'textfield',
        id:"search_datum_wind_direction",
        name:"search_datum_wind_direction",
        fieldLabel:"Wind Direction",
        width:400,  

};

var search_facility_track_spacing = {
        xtype: 'textfield',
        id:"search_facility_track_spacing",
        name:"search_facility_track_spacing",
        fieldLabel:"Search Track Space",
        width:400,
        hidden:true
};

var search_facility_attempt = {
        xtype: 'textfield',
        id:"search_facility_attempt",
        name:"search_facility_attempt",
        fieldLabel:"Search Attempt",
        width:400,
        value:1
};

var draw_search_btn = {
        xtype: 'button',
        id:"draw_search_btn",
        name:"draw_search_btn",
        text:"Create Plan",
        handler:function(){
            var search_pattern = Ext.getCmp("search_method_options").getValue();
            if(search_pattern == "VS")
                VS();
            else if(search_pattern == "SS")
                SS();
            else if(search_pattern == "PS")
                PS();
            else
                 console.log("Unknown Method");
                
        }
};




var search_form = {
        xtype       : 'form',
        autoheight:true,
        autowidth:true,
        id          : 'search_form',
        defaultType : 'field',
        frame       : true,
        items:[search_method_options,search_facility_object,search_datum_point_lat,search_datum_point_lon,search_datum_wind_direction,search_facility_radius,search_facility_track_spacing,search_facility_area_width,search_facility_area_length,search_facility_attempt]
};


function showSearchPlanWindow(){
      var search_form_window = new Ext.Window({
        id     : 'search_form_window',
        items  : [search_form],
        title:"Create Search Plan",
        buttons:[draw_search_btn]
    });
    
   
    search_form_window.show();
}

function CreatePolygonFromCenter(centerPoint,length,width){
    
    var lengthInMeters  = length * 1852;
    var widthInMeters  = width * 1852;
    
    var ULX = centerPoint.x - (lengthInMeters /2);
    var ULY = centerPoint.y + (widthInMeters /2);
    var ULpoint = new OpenLayers.Geometry.Point(ULX,ULY);
    
    var URX = centerPoint.x + (lengthInMeters /2);
    var URY = centerPoint.y + (widthInMeters /2);
    var URpoint = new OpenLayers.Geometry.Point(URX,URY);
    
    var LRX = centerPoint.x + (lengthInMeters /2);
    var LRY = centerPoint.y - (widthInMeters /2);
    var LRpoint = new OpenLayers.Geometry.Point(LRX,LRY);
    
    var LLX = centerPoint.x - (lengthInMeters /2);
    var LLY = centerPoint.y - (widthInMeters /2);
    var LLpoint = new OpenLayers.Geometry.Point(LLX,LLY);
    
    var pnts= [];
    
    pnts.push(ULpoint,URpoint,LRpoint,LLpoint,ULpoint);
    
    var rectangle_bounds = new OpenLayers.Geometry.LinearRing(pnts);
    
    var vector_feature_rectangle_bounds = new OpenLayers.Feature.Vector(rectangle_bounds, null, null);
    
    var search_area_vectorLayer = new OpenLayers.Layer.Vector("Assigned search area");
    
    search_area_vectorLayer.addFeatures([vector_feature_rectangle_bounds]);
    
    map.addLayer(search_area_vectorLayer);
    
    

var parallel_sweep_std_area_layerStoreArea = {
        title: "Assigned search area",
        name: "Assigned search area",
        bbox:search_area_vectorLayer.getDataExtent(),
        serviceUrl:"",
        serviceName:"",
        serviceType:"SVS",
        serviceServerType: "",
        legendImage:""
};

    map_simulation_layers_store.push(parallel_sweep_std_area_layerStoreArea);

    AddLayerToTree(search_area_vectorLayer,parallel_sweep_std_area_layerStoreArea);
    
    return  {
                ULpoint : ULpoint,
                URpoint : URpoint,
                LRpoint : LRpoint,
                LLpoint : LLpoint
            };
        
}


function PS(){
    
    var width = parseFloat(Ext.getCmp("search_facility_area_width").getValue());
    
    var length = parseFloat(Ext.getCmp("search_facility_area_length").getValue());
    
    var sweep_width = parseFloat(Ext.getCmp("search_facility_track_spacing").getValue()) * 1852;
    
    var lat = Ext.getCmp("search_datum_point_lat").getValue();
    
    var lon = Ext.getCmp("search_datum_point_lon").getValue();

    var datum_point =new OpenLayers.LonLat(lon,lat).transform( "EPSG:4326", "EPSG:900913");

    var datum_point_geometry = new OpenLayers.Geometry.Point(datum_point.lon, datum_point.lat);
    
    var area_corners = CreatePolygonFromCenter(datum_point_geometry,length,width);
      
    var total_sweep_width = sweep_width/2;
    
    var horizontal_lines_count = 0;
    
    //var sweep_point_horizontal_start = new OpenLayers.Geometry.Point(area_corners.ULpoint.x + (sweep_width/2),area_corners.ULpoint.y - (sweep_width/2));
   // var sweep_point_horizontal_stop = new OpenLayers.Geometry.Point(area_corners.URpoint.x - (sweep_width/2),area_corners.URpoint.y - //(sweep_width/2));
    
    var horizontal_line_length = (length*1852) - sweep_width;
    
    var sweep_point_horizontal_start, sweep_point_horizontal_stop, sweep_point_vertical;
    
    var parallel_sweep_layer = new OpenLayers.Layer.Vector("parrallel sweep");
    
    var pointsArray = [];
    
    while(total_sweep_width<width*1852)
        {
            horizontal_lines_count++;           
            
            if(horizontal_lines_count ==1){
                sweep_point_horizontal_start = new OpenLayers.Geometry.Point(area_corners.ULpoint.x + (sweep_width/2),area_corners.ULpoint.y - (sweep_width/2));
                
                sweep_point_horizontal_stop =  new OpenLayers.Geometry.Point(sweep_point_horizontal_start.x + horizontal_line_length,sweep_point_horizontal_start.y);
                
              
            }
            else{
                if(horizontal_lines_count % 2 ==0){
                    sweep_point_horizontal_start = new OpenLayers.Geometry.Point(sweep_point_horizontal_stop.x,sweep_point_horizontal_stop.y - sweep_width);
                    sweep_point_horizontal_stop = new OpenLayers.Geometry.Point(sweep_point_horizontal_start.x-horizontal_line_length,sweep_point_horizontal_start.y);
                }
                else{
                    sweep_point_horizontal_start = new OpenLayers.Geometry.Point(sweep_point_horizontal_stop.x,sweep_point_horizontal_stop.y - sweep_width);
                    sweep_point_horizontal_stop = new OpenLayers.Geometry.Point(sweep_point_horizontal_start.x+horizontal_line_length,sweep_point_horizontal_start.y);
                }
            }
                     
            total_sweep_width +=sweep_width;
            
            pointsArray.push(sweep_point_horizontal_start);
            
            pointsArray.push(sweep_point_horizontal_stop);
            
           
            
            //var featureSweep_point_horizontal_start = new OpenLayers.Feature.Vector(
            //    sweep_point_horizontal_start, null,null);
            
            //var featureSweep_point_horizontal_stop = new OpenLayers.Feature.Vector(
           //     sweep_point_horizontal_stop, null,null);
    
            //parallel_sweep_layer.addFeatures([featureSweep_point_horizontal_start,featureSweep_point_horizontal_stop]);         
        }
           var lineStr = new OpenLayers.Geometry.LineString(pointsArray);
            
           var style = { 
                strokeColor: '#0000ff', 
                strokeWidth: 2
                };
            
           var route_line = new OpenLayers.Feature.Vector(
                lineStr, null,style);
            
           parallel_sweep_layer.addFeatures(route_line);
            
           map.addLayer(parallel_sweep_layer);
    
            var parallel_sweep_layerStoreArea =  {
            title: "Paraller Sweep Search Layer",
            name: "Paraller Sweep Search Layer",
            bbox:parallel_sweep_layer.getDataExtent(),
            serviceUrl:"",
            serviceName:"",
            serviceType:"SVS",
            serviceServerType: "",
            legendImage:""
        };

    map_simulation_layers_store.push(parallel_sweep_layerStoreArea);

    AddLayerToTree(parallel_sweep_layer,parallel_sweep_layerStoreArea);
    
}

function SS(){
    
    var search_area_lay_name = "Search Area [ " + Ext.getCmp("search_facility_object").getValue() + "]";

    var search_area_vectorLayer = new OpenLayers.Layer.Vector(search_area_lay_name);
    
    var lat = Ext.getCmp("search_datum_point_lat").getValue();
    
    var lon = Ext.getCmp("search_datum_point_lon").getValue();

    var datum_point =new OpenLayers.LonLat(lon,lat).transform( "EPSG:4326", "EPSG:900913");

    var datum_point_geometry = new OpenLayers.Geometry.Point(datum_point.lon, datum_point.lat);
    
    var styleForDatumPoint = new  SarisLabelPointStyle("");
    styleForDatumPoint.fillColor= "#000000";

    var featureDatumPoint = new OpenLayers.Feature.Vector(
        datum_point_geometry,
        null,
       styleForDatumPoint
    );
    
    search_area_vectorLayer.addFeatures([featureDatumPoint]);

    map.addLayer(search_area_vectorLayer);

    map.setCenter(datum_point,8);    

    var layersearchStoreArea =  {
            title:search_area_lay_name,
            name:search_area_lay_name,
            bbox:search_area_vectorLayer.getDataExtent(),
            serviceUrl:"",
            serviceName:"",
            serviceType:"SVS",
            serviceServerType: "",
            legendImage:""
        };

    map_simulation_layers_store.push(layersearchStoreArea);

    AddLayerToTree(search_area_vectorLayer,layersearchStoreArea);
    
    var search_attempt = parseInt(Ext.getCmp("search_facility_attempt").getValue());
    
    var wind_direction = parseFloat(Ext.getCmp("search_datum_wind_direction").getValue());
    wind_direction = wind_direction<180?wind_direction+180:wind_direction-180;
    
    var S = parseFloat(Ext.getCmp("search_facility_track_spacing").getValue()) * 1852;
    
    CreateExpadingSquare(search_attempt,datum_point_geometry,S,wind_direction);
}
function CreateExpadingSquare(pass_number,datum_point,radius,wind_direction){
    
    var coords = [];
    
    var directions = new Array(4);
    
    if(pass_number == 1){
        directions[0] =  wind_direction;
    }
    else if(pass_number == 2){
         directions[0] = wind_direction + 45;
    }
    else {
        return;
    }
    
    for(var i = 1;i<directions.length; i++){
        directions[i] = directions[i-1] + 90;
    }
   
    
    var calculation_point = {X: datum_point.x, Y: datum_point.y};
    coords.push(new OpenLayers.Geometry.Point(calculation_point.X,calculation_point.Y));
  
    sPointA =   PolarCoordinatesCalculation(calculation_point.X,calculation_point.Y,radius,directions[0]);
    coords.push(new OpenLayers.Geometry.Point(sPointA.X,sPointA.Y));
    
    sPointB =   PolarCoordinatesCalculation(sPointA.X,sPointA.Y,radius,directions[1]);
    coords.push(new OpenLayers.Geometry.Point(sPointB.X,sPointB.Y));
    
    s2PointA =   PolarCoordinatesCalculation(sPointB.X,sPointB.Y,radius*2,directions[2]);
    coords.push(new OpenLayers.Geometry.Point(s2PointA.X,s2PointA.Y));
    
    s2PointB =   PolarCoordinatesCalculation(s2PointA.X,s2PointA.Y,radius*2,directions[3]);
    coords.push(new OpenLayers.Geometry.Point(s2PointB.X,s2PointB.Y));
    
    s3PointA =   PolarCoordinatesCalculation(s2PointB.X,s2PointB.Y,radius*3,directions[0]);
    coords.push(new OpenLayers.Geometry.Point(s3PointA.X,s3PointA.Y));
    
    s3PointB =   PolarCoordinatesCalculation(s3PointA.X,s3PointA.Y,radius*3,directions[1]);
    coords.push(new OpenLayers.Geometry.Point(s3PointB.X,s3PointB.Y));
    
    s4PointA =   PolarCoordinatesCalculation(s3PointB.X,s3PointB.Y,radius*4,directions[2]);
    coords.push(new OpenLayers.Geometry.Point(s4PointA.X,s4PointA.Y));
    
    s4PointB =   PolarCoordinatesCalculation(s4PointA.X,s4PointA.Y,radius*4,directions[3]);
    coords.push(new OpenLayers.Geometry.Point(s4PointB.X,s4PointB.Y));
    
    s5PointA =   PolarCoordinatesCalculation(s4PointB.X,s4PointB.Y,radius*5,directions[0]);
    coords.push(new OpenLayers.Geometry.Point(s5PointA.X,s5PointA.Y));
    
    s5PointB =   PolarCoordinatesCalculation(s5PointA.X,s5PointA.Y,radius*5,directions[1]);
    coords.push(new OpenLayers.Geometry.Point(s5PointB.X,s5PointB.Y));
    
    s6PointA =   PolarCoordinatesCalculation(s5PointB.X,s5PointB.Y,radius*6,directions[2]);
    coords.push(new OpenLayers.Geometry.Point(s6PointA.X,s6PointA.Y));
    
    s6PointB =   PolarCoordinatesCalculation(s6PointA.X,s6PointA.Y,radius*6,directions[3]);
    coords.push(new OpenLayers.Geometry.Point(s6PointB.X,s6PointB.Y));
    
    s7PointA =   PolarCoordinatesCalculation(s6PointB.X,s6PointB.Y,radius*7,directions[0]);
    coords.push(new OpenLayers.Geometry.Point(s7PointA.X,s7PointA.Y));
    
    var lineStr = new OpenLayers.Geometry.LineString(coords);
   
    var feature_linestr = new OpenLayers.Feature.Vector(lineStr);
    
    var style = { 
                strokeColor: '#0000ff', 
                strokeWidth: 2
                };
    
    var expandinq_square_layer = new OpenLayers.Layer.Vector("Expanding Square Layer",null, style);
    
    expandinq_square_layer.addFeatures([feature_linestr]);
    
    map.addLayer(expandinq_square_layer);
    
    var expandinq_square_layerStoreArea =  {
            title:"Expanding Square Layer",
            name:"Expanding Square Layer",
            bbox:expandinq_square_layer.getDataExtent(),
            serviceUrl:"",
            serviceName:"",
            serviceType:"SVS",
            serviceServerType: "",
            legendImage:""
        };

    map_simulation_layers_store.push(expandinq_square_layerStoreArea);

    AddLayerToTree(expandinq_square_layer,expandinq_square_layerStoreArea);
}



function CreateSectors(pass_number,datumpoint,csp,wind_direction,radius){
    debugger;
    var break_angle = 0; 
    var segments_number = 9;
    var line_direction = (wind_direction + 180) - 360;
    var calculation_point = {X: csp.x, Y: csp.y};
    var sectors_layer = new OpenLayers.Layer.Vector("Sectors Layer");
    var coordinatesArr = [];
    
    if(pass_number==1){
     break_angle =  (-60)*Math.PI / 180;
    }
    else if(pass_number==2){
         break_angle =  (-30)*Math.PI / 180;
    }
    else{
        return;
    }
    
    coordinatesArr.push(new OpenLayers.Geometry.Point(calculation_point.X,calculation_point.Y));
    
    for(i=1; i<=9; i++){
        if(i % 3 != 0)
        {
            if(i==2 && pass_number==2){
            
            calculation_point = PolarCoordinatesCalculation(calculation_point.X,calculation_point.Y,radius,line_direction);
                
            calculation_point.X -=  datumpoint.x;
            
            calculation_point.Y -=  datumpoint.y;
            
            xnew= calculation_point.X * Math.cos(break_angle) - calculation_point.Y* Math.sin(break_angle);
            
            ynew = calculation_point.Y * Math.cos(break_angle) + calculation_point.X * Math.sin(break_angle);
            
            calculation_point.X = xnew + datumpoint.x;
            calculation_point.Y = ynew + datumpoint.y;
            
            break_angle = break_angle *2;
            }
            else{
                calculation_point = PolarCoordinatesCalculation(calculation_point.X,calculation_point.Y,radius,line_direction); 
            }
           
        }
        else
        {
            if(i==9 && pass_number==2){
                calculation_point.X= csp.x;
                 calculation_point.Y= csp.y;
            }
            else{
                calculation_point.X -=  datumpoint.x;
                calculation_point.Y -=  datumpoint.y;

                xnew= calculation_point.X * Math.cos(break_angle) - calculation_point.Y* Math.sin(break_angle);

                ynew = calculation_point.Y * Math.cos(break_angle) + calculation_point.X * Math.sin(break_angle);

                calculation_point.X = xnew + datumpoint.x;
                calculation_point.Y = ynew + datumpoint.y;

                line_direction= parseFloat(CalculateBearing2(calculation_point.Y,calculation_point.X,datumpoint.y,datumpoint.x));
            }
          
        }
            
          var calculation_point_geom = new OpenLayers.Geometry.Point(calculation_point.X,calculation_point.Y);
         
          coordinatesArr.push(calculation_point_geom);
        
           var label = "";
        
            if(pass_number==1){
                if(i==1 || i==4  || i==7)
                {
                     label = "";    
                }
                else if(i==5  || i ==6)
                {
                     label = (i-2).toString();  
                }
                else if(i==8)
                {
                     label = (i-3).toString();  
                }
                else if(i==9){
                    label="";
                }
                else  {
                      label = (i-1).toString();
                }
            }
            else {
                
                if(i==1){
                   label = "1";  
                }
                else if(i==2|| i==3 ){
                    label = i.toString();
                }
                else if(i==4  || i==7)
                {
                     label = "";    
                }
                
                else if(i==5  || i ==6)
                {
                     label = (i-1).toString();  
                }
                else if(i==8)
                {
                     label = (i-2).toString();  
                }
                else if(i==9){
                    label="";
                }
                else  {
                      label = (i-1).toString();
                }
            }
            
           var  stylepointSector = new  SarisLabelPointStyle(label);
           stylepointSector.fillColor= "#000000";
      
          var feature_calculation_point = new OpenLayers.Feature.Vector(calculation_point_geom,null,stylepointSector);
        
          sectors_layer.addFeatures([ feature_calculation_point]);
    }
    
     var lineStr = new OpenLayers.Geometry.LineString(coordinatesArr);
   
    var style = { 
            strokeColor: '#0000ff', 
            strokeWidth: 2
            };
     var feature_linestr = new OpenLayers.Feature.Vector(lineStr,null,style);
    
    sectors_layer.addFeatures([ feature_calculation_point,feature_linestr]);
    
    map.addLayer(sectors_layer);

    var sectors_layerStoreArea =  {
            title:"Sectors Layer",
            name:"Sectors Layer",
            bbox:sectors_layer.getDataExtent(),
            serviceUrl:"",
            serviceName:"",
            serviceType:"SVS",
            serviceServerType: "",
            legendImage:""
        };

    map_simulation_layers_store.push(sectors_layerStoreArea);

    AddLayerToTree(sectors_layer,sectors_layerStoreArea);
}

function FindCSPPoint(windDirection,datum_point_geometry,radius){
  return  PolarCoordinatesCalculation(datum_point_geometry.x,datum_point_geometry.y,radius,windDirection);
}

function VS(){
    debugger;
    var search_area_lay_name = "Search Area [ " + Ext.getCmp("search_facility_object").getValue() + "]";

    var search_area_vectorLayer = new OpenLayers.Layer.Vector(search_area_lay_name);
    
    var lat = Ext.getCmp("search_datum_point_lat").getValue();
    
    var lon = Ext.getCmp("search_datum_point_lon").getValue();

    var datum_point =new OpenLayers.LonLat(lon,lat).transform( "EPSG:4326", "EPSG:900913");

    var datum_point_geometry = new OpenLayers.Geometry.Point(datum_point.lon, datum_point.lat);
    
    var radius = Ext.getCmp("search_facility_radius").getValue()*1852;
    
    var wind_direction = parseFloat(Ext.getCmp("search_datum_wind_direction").getValue());
    
    var searchCircle = OpenLayers.Geometry.Polygon.createRegularPolygon(datum_point_geometry,
                            radius, 40,0);
    
    var featureSearchcircle = new OpenLayers.Feature.Vector(searchCircle);

    var styleForDatumPoint = new  SarisLabelPointStyle("");
    styleForDatumPoint.fillColor= "#000000";

    var featureDatumPoint = new OpenLayers.Feature.Vector(
        datum_point_geometry,
        null,
       styleForDatumPoint
    );

    var csp = FindCSPPoint(wind_direction,datum_point_geometry,radius);
    
    var csp_geometry = new OpenLayers.Geometry.Point(csp.X,csp.Y);
    
    var csp_style = new  SarisLabelPointStyle("CSP");
    csp_style.fillColor= "#000000";
    
    var featurecsp =  new OpenLayers.Feature.Vector(
        csp_geometry,
        null,
        csp_style
    ); 
    
    search_area_vectorLayer.addFeatures([ featureSearchcircle,featureDatumPoint,featurecsp]);

    map.addLayer(search_area_vectorLayer);

    map.setCenter(datum_point,8);    

            var layersearchStoreArea =  {
                    title:search_area_lay_name,
                    name:search_area_lay_name,
                    bbox:search_area_vectorLayer.getDataExtent(),
                    serviceUrl:"",
                    serviceName:"",
                    serviceType:"SVS",
                    serviceServerType: "",
                    legendImage:""
                };

    map_simulation_layers_store.push(layersearchStoreArea);

    AddLayerToTree(search_area_vectorLayer,layersearchStoreArea);
    
    var search_attempt = parseInt(Ext.getCmp("search_facility_attempt").getValue());
    
    CreateSectors(search_attempt,datum_point_geometry,csp_geometry,wind_direction,radius);
   
}
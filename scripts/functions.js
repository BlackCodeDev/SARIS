//var leeway_speed = 1.3; //TO GET IT DYNAMIC
var datum_mode; 


Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
]);


function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function convertDDToDMM(deg,lng)
{
    var d = parseInt(deg);
    var minfloat  = Math.abs((deg-d) * 60); 
    var m = Math.floor(minfloat);
    var secfloat = (minfloat-m)*60;
    
    var decimalMinutes =  m + (secfloat / 60);
    
    return {
        dir : deg<0?lng?'W':'S':lng?'E':'N',
        deg : d,
        min : pad(decimalMinutes.toFixed(5))
    };
    
}

function findGridUnitWidthFactor(grid_system_code){
    for(var i in multiplication_factor_unit){
        var item = multiplication_factor_unit[i];
        if(item.gridSysten == grid_system_code)
            return  item.factor;
    }
    
    return null;
}

function CalculateGridULx(centerX,gridSystemSize,gridCellWidth){
    return centerX - ((gridSystemSize/2)*gridCellWidth);
}

function CalculateGridULy(centerY,gridSystemSize,gridCellWidth){
    return centerY + ((gridSystemSize/2)*gridCellWidth);
}

function CalculateGridLRx(centerX,gridSystemSize,gridCellWidth){
    return centerX + ((gridSystemSize/2)*gridCellWidth);
}

function CalculateGridLRy(centerY,gridSystemSize,gridCellWidth){
    return centerY - ((gridSystemSize/2)*gridCellWidth);
}


function CalculateGridURx(centerX,gridSystemSize,gridCellWidth){
    return centerX + ((gridSystemSize/2)*gridCellWidth);
}

function CalculateGridURy(centerY,gridSystemSize,gridCellWidth){
    return centerY + ((gridSystemSize/2)*gridCellWidth);
}


function CalulatePerpendiculars(x1,y1,x2,y2,theta,error_in_position){
   var r = 3 * error_in_position;
    
   var angleSource = theta<90 ?theta+90: theta - 90;
   var angle = (angleSource) * Math.PI / 180;
    
   var perp1StartX1 =  x1 + r * Math.cos(angle);
   var perp1StartY1 = y1 + r * Math.sin(angle);

   var perp1Start2X1 =  x1 - r * Math.cos(angle);
   var perp1Start2Y1 = y1 - r * Math.sin(angle);
    
   var perp1EndX2 = x2 + r * Math.cos(angle);
   var perplEndY2 = y2 + r * Math.sin(angle);
   var perp1End2X2 = x2 - r * Math.cos(angle);
   var perplEnd2Y2 = y2 - r * Math.sin(angle);
    
    var pointSource1 = new OpenLayers.Geometry.Point(x1,y1);
    var pointSource2 = new OpenLayers.Geometry.Point(x2,y2);
    
    var pointStart = new OpenLayers.Geometry.Point(perp1StartX1, perp1StartY1);
    var pointStart2 = new OpenLayers.Geometry.Point(perp1Start2X1, perp1Start2Y1);
    var pointEnd = new OpenLayers.Geometry.Point(perp1EndX2, perplEndY2);
    var pointEnd2 = new OpenLayers.Geometry.Point(perp1End2X2, perplEnd2Y2);
    
    var vectorLayerPerpPoints = new OpenLayers.Layer.Vector("test");
    

    var startFeature = new OpenLayers.Feature.Vector(pointStart);
    var endFeature = new OpenLayers.Feature.Vector(pointEnd);
    
    var startFeature2 = new OpenLayers.Feature.Vector(pointStart2);
    var endFeature2 = new OpenLayers.Feature.Vector(pointEnd2);
    
    var startSFeature = new OpenLayers.Feature.Vector(pointSource1);
    var endSFeature = new OpenLayers.Feature.Vector(pointSource2);
    
    
    
    vectorLayerPerpPoints.addFeatures([startFeature,endFeature,startSFeature,endSFeature,startFeature2,endFeature2]);
    map.addLayer(vectorLayerPerpPoints);  
    
    
    var result = {
                    start_perp_X1:perp1StartX1,
                    start_perp_Y1:perp1StartY1,
                    start_perp_X2:perp1Start2X1,
                    start_perp_Y2:perp1Start2Y1,
                    end_perp_X1:perp1EndX2,
                    end_perp_Y1:perplEndY2,
                    end_perp_X2:perp1End2X2,
                    end_perp_Y2:perplEnd2Y2,
                    theta:theta
                    
    };
    
    return result ;
}


function isControlTypeSelected(controlName){
    console.log(controlName);
    var ctl = Ext.getCmp(controlName);
    
    var selValue = ctl.getValue();
    
    return selValue != null;
}

function TimeToString(timeValue){
    if(timeValue){
        return timeValue.getHours() + ":" + timeValue.getMinutes() + ":" + timeValue.getSeconds();
    }
}

function MapCRSToEPSG(CRS)
{
    if(CRS.toUpperCase() == "CRS:84")
        return "EPSG:4326";
    else
        return CRS;
}

function convertDDToDMS(deg, lng){
    var d = parseInt(deg);
    var minfloat  = Math.abs((deg-d) * 60); 
    var m = Math.floor(minfloat);
    var secfloat = (minfloat-m)*60;
    var s = secfloat.toFixed(5); 
    d = Math.abs(d);

    if (Math.round(s)==60) {
        m++;
        s=0;
    }
    if (m==60) {
        d++;
        m=0;
    }

    return {
        dir : deg<0?lng?'W':'S':lng?'E':'N',
        deg : d,
        min : pad(m),
        sec : pad(s)
    };
}

function parseWKTGeom(geomText,callback)
{
    var layer_points = []; 
    
    var waypoints_layer=new OpenLayers.Layer.Vector("ddddd",{
		styleMap: new OpenLayers.StyleMap({
			'default':{
				strokeColor:"#FF7700",
				fillColor: "#FF9900",
				fontFamily: "Tahoma",
				fillOpacity: 0,
				pointRadius: 1,
				pointerEvents: "visiblePainted",
				labelOutlineColor:"#FFFFFF",
				labelOutlineWidth:2,
				strokeColor:"#FF7700",
				strokeWidth:2,
				strokeDashstyle:"dashdot",
				labelOutlineColor:"#FFFFFF",
				labelOutlineWidth:5,
			}
		})
	});
     
    var coordinates_array = geomText.split(",");
    debugger;
    for(var i=0;i<coordinates_array.length;i++){
        var coordinate =  coordinates_array[i].split(" ");
        var x= coordinate[0];
        var y = coordinate[1];
        var newPointFromText =  new OpenLayers.Geometry.Point(x, y);
        var newPointFromTextTransformed = newPointFromText.transform( "EPSG:4326", "EPSG:900913");
        layer_points.push(newPointFromTextTransformed);       
    }
   
    var lineStr = new OpenLayers.Geometry.LineString(layer_points )
    
    waypoints_layer.addFeatures([new OpenLayers.Feature.Vector(lineStr)]);
    
    map.addLayers([waypoints_layer]);

    map.zoomToExtent(waypoints_layer.getDataExtent());
    
    
    
    
    //add_waypoints_window.close();
    
    if(callback){
        callback(lineStr);
    }
    
  
    
}

function GetKMLFromFeatures(features) {
    var format = new OpenLayers.Format.KML({
        'maxDepth':10,
        'extractStyles':true,
        'internalProjection': map.baseLayer.projection,
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
    });

    return format.write(features);
}

function pointDatumResultProcessing(data,layNameGrid){
    
    var squares = data.split("~");
    
    var vectorLayerSquare = new OpenLayers.Layer.Vector(layNameGrid,{
                    styleMap: new OpenLayers.StyleMap({'default':{
                    strokeColor: "#00FF00",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    fillColor: "#FF5500",
                    fillOpacity: 0,
                    pointRadius: 6,
                    pointerEvents: "visiblePainted",
                    label : "${prob}",                   
                    fontColor: "red",
                    fontSize: "12px",
                    fontFamily: "Courier New, monospace",
                    fontWeight: "bold",
                    labelXOffset: "0",
                    labelYOffset: "0",
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3
                }})});
    
    for(var i = 0;i<squares.length-1;i++){
            var geomArray = [];
            var square = squares[i];
            var propability_geometry = square.split("|");
            var geometry = propability_geometry[0];
            var propability = propability_geometry[1];

            var squareCoordinates = geometry.split(" ");

            geomArray.push([parseFloat(squareCoordinates[0]),parseFloat(squareCoordinates[1])]);
            geomArray.push([parseFloat(squareCoordinates[2]),parseFloat(squareCoordinates[3])]);
            geomArray.push([parseFloat(squareCoordinates[4]),parseFloat(squareCoordinates[5])]);
            geomArray.push([parseFloat(squareCoordinates[6]),parseFloat(squareCoordinates[7])]);
            geomArray.push([parseFloat(squareCoordinates[0]),parseFloat(squareCoordinates[1])]);

            var points = [
                new OpenLayers.Geometry.Point(parseFloat(squareCoordinates[0]), parseFloat(squareCoordinates[1])),
                new OpenLayers.Geometry.Point(parseFloat(squareCoordinates[2]), parseFloat(squareCoordinates[3])),
                new OpenLayers.Geometry.Point(parseFloat(squareCoordinates[4]), parseFloat(squareCoordinates[5])),
                new OpenLayers.Geometry.Point(parseFloat(squareCoordinates[6]), parseFloat(squareCoordinates[7]))                               
            ];    

            var ring = new OpenLayers.Geometry.LinearRing(points);

            var polygon = new OpenLayers.Geometry.Polygon([ring]);   

            var squareVectorFeature = new OpenLayers.Feature.Vector(polygon);
            squareVectorFeature.attributes = {prob: propability};

            vectorLayerSquare.addFeatures([squareVectorFeature]);
        }
    
    map.addLayer(vectorLayerSquare);
    
    var layerSimStoreGrid =  {
                    title:layNameGrid,
                    name:layNameGrid,
                    bbox:vectorLayerSquare.getDataExtent(),
                    serviceUrl:"",
                    serviceName:"",
                    serviceType:"SVS",
                    serviceServerType: "",
                    legendImage:""
                };

    map_simulation_layers_store.push(layerSimStoreGrid);

    AddLayerToTree(vectorLayerSquare,layerSimStoreGrid);
    
}

function SendRequestToGProcess(url,servletName,sendObj,callback){
    Ext.Ajax.request({
        url : url,
        method: 'GET', 
        headers: { 'Content-Type': 'application/json'},
        
        params  : {servlet : servletName, data : Ext.JSON.encode(sendObj)},  
        success: function ( result, request ) {
             var resultData1 = JSON.parse(result.responseText);
             if(callback)
                 callback(resultData1);
        },
        failure: function ( result, request ) {
          resultData = JSON.parse(xmlhttp.responseText);
        }        
    });
}


function FindSearchFactor(fs,datum_method){
    
    var searchFactorDS = null;
    
    if(datum_method =="POINT_DATUM"){
        searchFactorDS = fs_search_factor_ds_point_datum;
    }
    else{
        searchFactorDS = fs_search_factor_ds_line_datum;
    }
    
   for (var i=0; i<searchFactorDS.length;i++){
   
       var search_factor_item = searchFactorDS[i];
       
       if(fs>search_factor_item.fsFrom && fs<=search_factor_item.fsTo){
           return search_factor_item.value;
       }
   }
    
    return null;
}



function FindLeewaySpeed(wind_speed){
     if(Ext.getCmp("vessel_subtype").getValue()!= null)
         {
             var seletedVesselSubType = Ext.getCmp("vessel_subtype").findRecordByValue(Ext.getCmp("vessel_subtype").getValue()).data;
             for(var i=0;i<vessel_sub_types_equatuions_ds.length;i++){
                 var equation_item = vessel_sub_types_equatuions_ds[i];
                 if(equation_item.CASE == seletedVesselSubType.vsl_case){
                     var windRanges = equation_item.WIND_RANGES;
                     for(var j=0;j<windRanges.length;j++){
                          var examinedRange = windRanges[j];
                          var fromSpeed = examinedRange.WIND_SPEED_FROM;
                          var toSpeed = examinedRange.WIND_SPEED_TO;
                          if(wind_speed>fromSpeed && wind_speed<=toSpeed){
                             var equation = examinedRange.EQUATION_TYPE;
                              debugger;
                              if(equation ==1){
                                  
                                  return examinedRange.a * wind_speed;
                              }
                              else if(equation ==2){
                                  return (examinedRange.a * wind_speed) + examinedRange.b;
                              }
                              else {
                                  return null;
                              }
                         }
                     }
                 }
             }                                                                                                                                                                            
        }
}
    
    

                                                                                       
function GetLeewayData(){
 
     if(Ext.getCmp("vessel_subtype").getValue()!= null && Ext.getCmp("aws_avg_downwind").getValue()!=""){
         
        var vsl_selected_subtype =  Ext.getCmp("vessel_subtype").getValue();
        var record =  Ext.getCmp("vessel_subtype").findRecordByValue(vsl_selected_subtype);
        var leeway_div_angle = record.data.vsl_subtype_leeway_angle;
        var leeway_error = record.data.vsl_subtype_leeway_errorKnots;
         //TO DO CALCULATION
  
  
        var down_wind_dir = parseFloat(Ext.getCmp("aws_avg_downwind").getValue());
         
        var left_leeway = down_wind_dir - leeway_div_angle;
        var left_leeway_refined = left_leeway<0 ? left_leeway+360:left_leeway; // ??
        Ext.getCmp("leeway_left_dir").setValue(left_leeway_refined.toFixed(2));
        var right_leeway = down_wind_dir + leeway_div_angle;
        var right_leeway_refined = right_leeway >360 ?right_leeway - 360:right_leeway; //?
        Ext.getCmp("leeway_right_dir").setValue(right_leeway_refined.toFixed(2));
         
        debugger;
         
        var temp = Math.pow(parseFloat(Ext.getCmp("sea_current_prob_error").getValue()),2) +
             Math.pow(parseFloat(Ext.getCmp("awsdve").getValue()),2)  + Math.pow(leeway_error,2);
         
        var dve = Math.sqrt(temp);
         
        Ext.getCmp("pdve").setValue(dve.toFixed(1));
    }
    
}

function CalculateCartesianDistance(x1,y1,x2,y2,SI) {
    
    if(SI==="undefined"){
         x1 = x1;
         y1=y1;
         x2=x2;
         y2=y2;
         SI ="meters";
    }
    
    var distanceInMeters = Math.sqrt(Math.pow((y2-y1),2) + Math.pow((x2-x1),2));
    
    if(SI = "meters"){
        return distanceInMeters;
    }
    else if(SI="nm"){
        return  distanceInMeters *1852;
    }
    else{
        return null;
    }
    
}

function PolarCoordinatesCalculation(x,y,R,theta){
    //var  dx = R * Math.sin(theta); 
    //var  dy = R * Math.cos(theta); 
    var  dx = R * Math.sin(theta* Math.PI/180) ;
    var  dy = R * Math.cos(theta* Math.PI/180); 
    return {X:x+dx,Y : y+dy};
}

function CalculateBearing2(latFrom, lonFrom, latTo, lonTo) {
     
        var p1 =  new OpenLayers.Geometry.Point(lonFrom,latFrom).transform("EPSG:900913", "EPSG:4326");

        var p2 =  new OpenLayers.Geometry.Point(lonTo,latTo).transform("EPSG:900913", "EPSG:4326");

        var lon1 = p1.x;
        var lat1 = p1.y;
        var lon2 = p2.x;
        var lat2 = p2.y;
    
        var dLon = rad(lon2-lon1);
        var y = Math.sin(dLon) * Math.cos(rad(lat2));
        var x = Math.cos(rad(lat1))*Math.sin(rad(lat2)) - Math.sin(rad(lat1))*Math.cos(rad(lat2))*Math.cos(dLon);
        var brng =Math.atan2(y, x) * 180 / Math.PI;

        var result = ((brng + 360) % 360);
        
        return result.toFixed(2);
 
}

function CalculateTotalSurfaceDrift(TWC_speed,TWC_angle,LEEWAY_Left_speed,LEEWAY_Left_Angle,LEEWAY_Right_speed,LEEWAY_Right_Angle){
   
    var driftInterval = parseFloat(Ext.getCmp("drift_interval").getValue());
    
    var TWC_x = TWC_speed*Math.sin(TWC_angle * Math.PI/180);
    var TWC_y = TWC_speed*Math.cos(TWC_angle * Math.PI/180); 
    
    //LEFT CALCULATIONS
    var LEEWAY_Left_x = LEEWAY_Left_speed*Math.sin(LEEWAY_Left_Angle * Math.PI/180);
    var LEEWAY_Left_y = LEEWAY_Left_speed*Math.cos(LEEWAY_Left_Angle * Math.PI/180);
    
    var Drift_left_speed = Math.sqrt(Math.pow(TWC_x + LEEWAY_Left_x,2)+Math.pow(TWC_y+ LEEWAY_Left_y,2));
    var Drift_left_angle =(Math.atan((TWC_x+LEEWAY_Left_x)/(TWC_y+ LEEWAY_Left_y))) *180 /Math.PI;
    
    var Drift_left_distance = Drift_left_speed * 1852 * driftInterval;
    
    //RIGHT CALCULATIONS
    var LEEWAY_Right_x = LEEWAY_Right_speed*Math.sin(LEEWAY_Right_Angle * Math.PI/180);
    var LEEWAY_Right_y = LEEWAY_Right_speed*Math.cos(LEEWAY_Right_Angle * Math.PI/180);
    
    var Drift_right_speed= Math.sqrt(Math.pow(TWC_x+ LEEWAY_Right_x,2) + Math.pow(TWC_y+ LEEWAY_Right_y,2));
    
    var Drift_right_angle=(Math.atan((TWC_x + LEEWAY_Right_x)/ (TWC_y + LEEWAY_Right_y))) *180/Math.PI;
    
    var Drift_right_distance = Drift_right_speed * 1852 * driftInterval;
    
    
    return {
          drift_left_speed : Drift_left_speed,
          drift_left_angle : Drift_left_angle<0?Drift_left_angle+360:Drift_left_angle,
          drift_left_distance : Drift_left_distance,
          drift_right_speed : Drift_right_speed,
          drift_right_angle : Drift_right_angle<0?Drift_right_angle+360:Drift_right_angle,
          drift_right_distance : Drift_right_distance
    };
}

function CalculateDivergPositions(x,y,rLeft,thetaLeft,rRight,thetaRight){
    
    var leftCoordinates  = PolarCoordinatesCalculation(x,y,rLeft,thetaLeft);
    var rightCoordinates = PolarCoordinatesCalculation(x,y,rRight,thetaRight);
    
    var diverg_dist_calc =  CalculateCartesianDistance(leftCoordinates.X,leftCoordinates.Y,rightCoordinates.X,rightCoordinates.Y,"nm");
    
    var leftCoordinatesWGS =  new OpenLayers.Geometry.Point(leftCoordinates.X, leftCoordinates.Y).transform("EPSG:900913", "EPSG:4326");
    var rightCoordinatesWGS =  new OpenLayers.Geometry.Point(rightCoordinates.X, rightCoordinates.Y).transform("EPSG:900913", "EPSG:4326");
   
    Ext.getCmp("diverg_pos_lat_left_downwind").setValue(leftCoordinatesWGS.y);
    Ext.getCmp("diverg_pos_lon_left_downwind").setValue(leftCoordinatesWGS.x);
    Ext.getCmp("diverg_pos_lat_right_downwind").setValue(rightCoordinatesWGS.y);
    Ext.getCmp("diverg_pos_lon_right_downwind").setValue(rightCoordinatesWGS.x);
    
    Ext.getCmp("diverg_pos_div_distance").setValue((diverg_dist_calc/1852).toFixed(2));
}


function CalculateMisObjectPosError(){
     
    var lat = Ext.getCmp("txt_missed_lat").getValue();
    var lon = Ext.getCmp("txt_missed_lon").getValue();

    var tPoint =new OpenLayers.LonLat(lon,lat).transform( "EPSG:4326", "EPSG:900913");

    var point = new OpenLayers.Geometry.Point(tPoint.lon, tPoint.lat);

    var devicePositionError = GetErrorValueUsingDeviceType() * 1852;

    var vesselTypeError = GetErrorValueUsingCraftType() * 1852;

    var drError = GetErrorBasedOnDR();

    console.log([devicePositionError,vesselTypeError,drError]);

    var totalPositionError = devicePositionError + vesselTypeError + drError;

    return totalPositionError;
}


function CalculateWeatherFactorSearch(wind){
    
    var vessel_length = Ext.getCmp("vessel_length").getValue();
  
 
    
    var vessel_subtype = Ext.getCmp("vessel_subtype").getValue();
    
    var parent_vessel_type =  Ext.getCmp("vessel_subtype").findRecordByValue(vessel_subtype).GENERAL_TYPE;
    
    if (wind>=0 && wind<=15){
        return 1;
         
    }
    else if (wind>=16 && wind<=25)
    {
        if(parent_vessel_type == "RAFT" || parent_vessel_type == "PIW" ||  vessel_length<10){
                return 0.5;   
        }
        else{
                return 0.9;
        }
    }
    
    else if (wind>=26){
        if(parent_vessel_type == "RAFT" || parent_vessel_type == "PIW" ||  vessel_length<10){
                return 0.25;   
        }
        else{
                return 0.9;
        }
    }
    else{
        return null;
    }
}
function sweepBasedLength(sweep_data,length){
    
    var minValueFound, maxValueFound;
    
    sweep_dataSorted = sweep_data.sort(function(a,b){
        return a.length - b.length;
    });
    
   for(var i=0;i<sweep_dataSorted.length;i++){
      
        if(length==sweep_dataSorted[i].length)
        {
            
            minValueFound=sweep_dataSorted[i];
            maxValueFound = sweep_dataSorted[i];
            break;
        }
        else{
            if(length<sweep_dataSorted[i].length)
                {
                      minValueFound=sweep_dataSorted[i-1];
                      maxValueFound = sweep_dataSorted[i];
                      break;
                }
        }          
    }
   var result = {sweepMnValue : minValueFound,sweepMxValue : maxValueFound};
   console.log(result);
   return DecideSweepWidth(result,"length",length);
}
function sweepBasedPersons(sweep_data,persons){
   
    var minValueFound, maxValueFound;
    
    sweep_dataSorted = sweep_data.sort(function(a,b){
        return a.persons - b.persons;
    });
    
    for(var i=0;i<sweep_dataSorted.length;i++){
      
        if(persons==sweep_dataSorted[i].persons)
        {
            
            minValueFound=sweep_dataSorted[i];
            maxValueFound = sweep_dataSorted[i];
            break;
        }
        else{
            if(persons<sweep_dataSorted[i].persons)
                {
                      minValueFound=sweep_dataSorted[i-1];
                      maxValueFound = sweep_dataSorted[i];
                      break;
                }
        }          
    }
    var result = {sweepMnValue : minValueFound,sweepMxValue : maxValueFound};
    console.log(result);
    return DecideSweepWidth(result,"persons",persons);
    //return {sweepMnValue : minValueFound,sweepMxValue : maxValueFound};
}

function DecideSweepWidth(min_max_obj,parameterType,parameterValue){
    var stdFromMin,stdFromMax;
    if(min_max_obj.sweepMnValue == min_max_obj.sweepMxValue)
        return min_max_obj.min_max_obj.sweepMnValue
    else{
        return min_max_obj.sweepMxValue.sweep;
        /*
        if(parameterType=="persons"){
            stdFromMin = Math.abs(parameterValue - min_max_obj.sweepMnValue.persons);
            stdFromMax = Math.abs(parameterValue - min_max_obj.sweepMxValue.persons);
            if(stdFromMin>stdFromMax)
                return  min_max_obj.sweepMxValue.sweep;
            else
                return  min_max_obj.sweepMnValue.sweep;
        }
        else if(parameterType=="length"){
            stdFromMin = Math.abs(parameterValue - min_max_obj.sweepMnValue.length);
            stdFromMax = Math.abs(parameterValue - min_max_obj.sweepMxValue.length);
            if(stdFromMin>stdFromMax)
                return  min_max_obj.sweepMxValue.sweep;
            else
                return  min_max_obj.sweepMnValue.sweep;
        }
        else{
            return null;
        }
        */
    }
}


function CalculateUnCorrectedSweepWidth(search_fac_type,visibility,altitude,vessel_sub_type,vessel_length,vessel_persons){
    if(search_fac_type==="Fixed Wing"){
        for(var i=0;i<sweep_width_wing.length;i++){
            var wingItem = sweep_width_wing[i];
            if(altitude==wingItem.altitude){
                visibility_values = wingItem.visibility;
                for(j=0;j<visibility_values.length;j++){
                    if(visibility==visibility_values[j].value){
                        var sweep_data = visibility_values[j].data;
                        var sweep_values_per_type = [];
                        for(k=0;k<sweep_data.length;k++){
                             if(vessel_sub_type ==sweep_data[k].vsl_subtype)                                
                                     sweep_values_per_type.push(sweep_data[k]);                               
                        }
                        if(vessel_length != null && vessel_persons==null)
                            return sweepBasedLength(sweep_values_per_type,vessel_length);
                        else 
                            return sweepBasedPersons(sweep_values_per_type,vessel_persons);
                    }
                }
            }
        }
    }
    else if(search_fac_type==="Helicopter"){
        for(var i=0;i<sweep_width_helicopter.length;i++){
            var wingItem = sweep_width_helicopter[i];
            if(altitude==wingItem.altitude){
                visibility_values = wingItem.visibility;
                for(j=0;j<visibility_values.length;j++){
                    if(visibility==visibility_values[j].value){
                        var sweep_data = visibility_values[j].data;
                        var sweep_values_per_type = [];
                        for(k=0;k<sweep_data.length;k++){
                             if(vessel_sub_type ==sweep_data[k].vsl_subtype)                                
                                     sweep_values_per_type.push(sweep_data[k]);                               
                        }
                        if(vessel_length != null && vessel_persons==null)
                            return sweepBasedLength(vessel_length);
                        else 
                            return sweepBasedPersons(vessel_persons);
                    }
                }
            }
        }
    }
    else{}
}

function CalculateFatigueFactorSearch(){
    return 1;
}
function CalculateVelocityFactorSearch(speed,search_facilityType){
    var vessel_length = Ext.getCmp("vessel_length").getValue();
    
 
       
    var vessel_subtype = Ext.getCmp("vessel_subtype").getValue();
    
    var persons = Ext.getCmp("persons_raft").getValue();
    
    var parent_vessel_type =  Ext.getCmp("vessel_subtype").findRecordByValue(vessel_subtype).data.GENERAL_TYPE;
    
    if(search_facilityType =="Fixed Wing"){
        if(parent_vessel_type == "RAFT"){           
                if(speed<=150){
                    return 1.1;
                }
                else if (speed>150 && speed<=180){
                    return 1;
                }
                else if (speed>180 && speed <=210){
                    return 0.9;
                }         
        }
        else if(parent_vessel_type == "POWER_BOAT"){
            if(vessel_length<=10){
                 if(speed<=150){
                    return 1.1;
                }
                else if (speed>150 && speed<=180){
                    return 1;
                }
                else if (speed>180 && speed <=210){
                    return 0.9;
                }
            }
            else{
               if(speed<=150){
                    return 1.1;
                }
                else if (speed>150 && speed<=180){
                    return 1;
                }
                else if (speed>180 && speed <=210){
                    return 1;
                }
            }
        }
        else if(parent_vessel_type == "SAILING"){
            if(vessel_length<=8){
                 if(speed<=150){
                    return 1.1;
                }
                else if (speed>150 && speed<=180){
                    return 1;
                }
                else if (speed>180 && speed <=210){
                    return 0.9;
                }
            }
            else{
                if(speed<=150){
                    return 1.1;
                }
                else if (speed>150 && speed<=180){
                    return 1;
                }
                else if (speed>180 && speed <=210){
                    return 1;
                }
            }
        }
        else if(parent_vessel_type == "PIW"){
            if(speed<=150){
                    return 1.2;
                }
                else if (speed>150 && speed<=180){
                    return 1;
                }
                else if (speed>180 && speed <=210){
                    return 0.9;
                }
        }
        else { //other ships
            return 1;  
        }
    }
    else{ //it is helicopter
        if(parent_vessel_type == "RAFT"){
            if(persons<4){
                if(speed<=60){
                    return 1.3
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                     return 0.9;
                } 
                else if (speed>120 && speed <=140){
                    return 0.8;
                } 
            }
            else{
                 if(speed<=60){
                    return 1.2;
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                    return 0.9;
                } 
                else if (speed>120 && speed <=140){
                    return 0.8;
                } 
            }
        }
        else if(parent_vessel_type == "POWER_BOAT"){
            if(vessel_length<=10){
                 if(speed<=60){
                    return 1.2;
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                    return 0.9;
                } 
                else if (speed>120 && speed <=140){
                    return 0.8;
                } 
            }
            else{
               if(speed<=60){
                    return 1.1;
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                    return 0.9;
                } 
                else if (speed>120 && speed <=140){
                    return 0.9;
                } 
            }
        }
        else if(parent_vessel_type == "SAILING"){
            if(vessel_length<=8){
                if(speed<=60){
                    return 1.2;
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                    return 0.9;
                } 
                else if (speed>120 && speed <=140){
                    return 0.9;
                } 
            }
            else{
                 if(speed<=60){
                    return 1.1;
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                    return 0.9;
                } 
                else if (speed>120 && speed <=140){
                    return 0.9;
                } 
            }
        }
        else if(parent_vessel_type == "PIW"){
            if(speed<=60){
                    return 1.5;
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                    return 0.8;
                } 
                else if (speed>120 && speed <=140){
                    return 0.7;
                } 
        }
        else { //other ships
           if(speed<=60){
                    return 1.1;
                }
                else if (speed>60 && speed<=90){
                    return 1;
                }
                else if (speed>90 && speed <=120){
                    return 1;
                } 
                else if (speed>120 && speed <=140){
                    return 0.9;
                } 
        }
    }
}




function CalculateCorrectedSweepWidth (UncorrectedSweepFactor,WeatherFactor,VelocityFactor,FatigueFactor){
    return UncorrectedSweepFactor*WeatherFactor*VelocityFactor*FatigueFactor;
}

function CalculateSearchEffort(facilitySpeed,facilityEndurace,CorrectedSweepWidth){
    return facilitySpeed * (facilityEndurace) * CorrectedSweepWidth;
}

//**********************************
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
function ClearAllocationFacilitiesGrid()
{
    Ext.getCmp("effort_allocation_facilities_grid").getStore().removeAll();   
}
function  CalculateFacilitiesAllocation(datum_mode){
      ClearAllocationFacilitiesGrid();
      debugger;
      var searchFaciltyRecords =  Ext.getCmp("gridPointSearchFacilities").getStore().getRange();
    
      var total_adjusted_search_area = 0;
      var adjusted_search_radius = 0;
      var adjusted_search_area_length = 0;
      var adjusted_search_area_width = 0;
    
      for(var i = 0; i<searchFaciltyRecords.length;i++){
          if(searchFaciltyRecords[i].data.AIRCRAFT_TYPE != "" && searchFaciltyRecords[i].data.AVIATION_TYPE !=""){
            var obj = CalculateOptimalTrackDataPerSearch(searchFaciltyRecords[i])     
            total_adjusted_search_area += parseFloat(obj.ADJUSTED_AREA);
            effort_allocation_facilities.add(obj);
          }
        }
    
      var hasDivergence = Ext.getCmp("diverg_pos_div_distance").getValue() !=""
    
      if(datum_mode == "POINT_DATUM"){
          
        
          
          if(hasDivergence){
            adjusted_search_radius = ((Math.sqrt(Math.pow(parseFloat(Ext.getCmp("diverg_pos_div_distance").getValue()),2) + (4*total_adjusted_search_area))) -  parseFloat(Ext.getCmp("diverg_pos_div_distance").getValue()))/4;
              
            adjusted_search_area_length = (2*adjusted_search_radius) + parseFloat(Ext.getCmp("diverg_pos_div_distance").getValue());
          }
          else{
             adjusted_search_radius = Math.sqrt(total_adjusted_search_area)/2;
             adjusted_search_area_length = 2*adjusted_search_radius ;
          }
          
           
      }
      else if(datum_mode == "LINE_DATUM"){
          adjusted_search_radius = 0;//total_adjusted_search_area /2 *L
          adjusted_search_area_length = 0; //
      }
      else{
        adjusted_search_radius = null;
        adjusted_search_area_length = null;
     }
     
      adjusted_search_area_width = 2 *adjusted_search_radius
      
      Ext.getCmp("adjusted_search_radius_txt").setValue(adjusted_search_radius.toFixed(2));
      Ext.getCmp("total_adjusted_search_area_txt").setValue(total_adjusted_search_area.toFixed(2));
      
      Ext.getCmp("adjusted_search_area_length_txt").setValue(adjusted_search_area_length);
      Ext.getCmp("adjusted_search_area_width_txt").setValue(adjusted_search_area_width);
        
}


function CalculateOptimalTrackDataPerSearch(facility_record){
   
   var rec_aircraft_type = facility_record.data.AIRCRAFT_TYPE;
   var rec_aviation_type = facility_record.data.AVIATION_TYPE;
   var rec_aviation_area = facility_record.data.AREA;
   var rec_aircraft_speed = parseFloat(facility_record.data.AIRCRAFT_SPEED);
   var track_spacing =  facility_record.data.CALC_CORRECTED_SWEEP_WIDTH/parseFloat(Ext.getCmp("total_effort_allocation_optimal_coverage_factor").getValue());
   
   var nearest_track_spacing = round(track_spacing,1);
   
   var adjusted_search_area = rec_aircraft_speed * facility_record.data.CALC_SEARCH_ENDURANCE * nearest_track_spacing;
    
  return {
      AIRCRAFT_TYPE:rec_aircraft_type,
      AVIATION_TYPE:rec_aviation_type,
      TRACK_SPACING:track_spacing.toString(),
      NEAREST_TRACK_SPACING:nearest_track_spacing.toString(),
      ADJUSTED_AREA :adjusted_search_area.toString()
  };
        
}

function showCoordsPanel(flag)
{  
    var coordsPanel = Ext.getCmp("missed_object_coords_control");
                                           
    if(flag){
        Ext.getCmp("txt_missed_lat").setValue(null);
        Ext.getCmp("txt_missed_lon").setValue(null);
         coordsPanel.show();
    }
    else{coordsPanel.hide();}
        
}


function GetErrorValueUsingCraftType(){
    
    if(Ext.getCmp("vessel_position_cmb").getValue() !="1" && Ext.getCmp("vessel_position_cmb").getValue()!=null) return 0;
    
    if(isControlTypeSelected("vessel_type_cmb")){
         var ctl = Ext.getCmp("vessel_type_cmb");
        var record = ctl.findRecordByValue(ctl.getValue());
        
        return record.data.vsl_type_error;  
    }
    else{
        return 0;
    }
}



function GetErrorBasedOnDR(){
    
    var drDistanceValue  = Ext.getCmp("drDistance").getValue();
    
    if(drDistanceValue != null && isControlTypeSelected("vessel_type_cmb")){
       
       var selectedVesselType = Ext.getCmp("vessel_type_cmb");
       var ctl = Ext.getCmp("vessel_type_cmb");
       var record = ctl.findRecordByValue(ctl.getValue());
        
       return ((record.data.DR_error * 1852) * drDistanceValue);
    }
    else{
        return 0;
    }
}

function GetErrorValueUsingDeviceType(){
    
    if(isControlTypeSelected("vessel_position_cmb")){
        var ctl = Ext.getCmp("vessel_position_cmb");
        var record = ctl.findRecordByValue(ctl.getValue());
        
        return record.data.device_error;  
    }
    else {
        
        return 0;
    }
}

function findGridSystemUsingSearchFactor(factor_value){
 
  var min_value_factor = 0;
  var i=0;
    
  while(factor_value>min_value_factor){
      min_value_factor = search_factor_ds[i][1];
      i++;      
   }
   
    var gridSystemObject  = {
            grid_system: search_factor_ds[i-1][2],
            grid_system_size:search_factor_ds[i-1][3]
        };
    
  return gridSystemObject;    
    
  /*
    if(isControlTypeSelected("search_factor_cmb")){
        var ctl = Ext.getCmp("search_factor_cmb");
        var record = ctl.findRecordByValue(ctl.getValue());
        var gridSystemObject  = {
            grid_system: record.data.factor_grid_system,
            grid_system_size:record.data.factor_grid_system_cells
        };
        return gridSystemObject;  
    }
    else{return null;}
    */
}


function combineDateWithTime(d, t)
{
   return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    t.getHours(),
    t.getMinutes(),
    t.getSeconds(),
    t.getMilliseconds()
    );
}

function CalculateHoursDiff(){
    

    var incident_dateval = Ext.getCmp("incident_date").getValue();
    var incident_timeval = Ext.getCmp("incident_time").getValue();
   
    var commenced_dateval =Ext.getCmp("commenced_date").getValue();
    var commenced_time =Ext.getCmp("commenced_time").getValue();
  
    if(incident_dateval!=null && incident_timeval != null && commenced_dateval !=null && commenced_time!=null){
        console.log([inc_datetime,commenced_datetime]);
        
        var commenced_datetime = combineDateWithTime(commenced_dateval,commenced_time);
        var inc_datetime = combineDateWithTime(incident_dateval,incident_timeval);
        
        var hours = Math.abs(commenced_datetime - inc_datetime) / (60*60*1000);
        Ext.getCmp("drift_interval").setValue(hours.toFixed(2));
    }
    
  
}

function CalculateHoursDiffGeneric(dateFrom,timeFrom,dateTo,timeTo){
    

    var incident_dateval = dateFrom;
    var incident_timeval = timeFrom;
   
    var commenced_dateval =dateTo;
    var commenced_time =timeTo;
  
    if(incident_dateval!=null && incident_timeval != null && commenced_dateval !=null && commenced_time!=null){
        console.log([inc_datetime,commenced_datetime]);
        
        var commenced_datetime = combineDateWithTime(commenced_dateval,commenced_time);
        var inc_datetime = combineDateWithTime(incident_dateval,incident_timeval);
        
        var hours = Math.abs(commenced_datetime - inc_datetime) / (60*60*1000);
        return(hours);
    }
    
  
}


function PointDatumProbMap(){
    debugger;
    var incident_Error_Layer_Name = "Position Error : " + Ext.getCmp("incident_name_control").getValue();
    var incident_grid_Layer_Name = "Point Datum Grid : " + Ext.getCmp("incident_name_control").getValue();
    var vectorLayer = new OpenLayers.Layer.Vector(incident_Error_Layer_Name);
    var lat = Ext.getCmp("txt_missed_lat").getValue();
    var lon = Ext.getCmp("txt_missed_lon").getValue();

    var tPoint =new OpenLayers.LonLat(lon,lat).transform( "EPSG:4326", "EPSG:900913");

    var point = new OpenLayers.Geometry.Point(tPoint.lon, tPoint.lat);

    var totalPositionError = CalculateMisObjectPosError();

    console.log( "Total Position Error:" + totalPositionError);
    
    var search_factor = parseFloat(Ext.getCmp("total_effort_allocation_optimal_search_factor").getValue());
    
    var  gridSystemInfo = findGridSystemUsingSearchFactor(search_factor);                                           

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

    SendRequestToGProcess(web_app_url + "/servlets_proxy.php","Simulation",sendObj,function(data){
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
    );                                                                           // CreateTest();
}

function LineDatumProbMap(){
    
    debugger;
    
    var incident_Error_Layer_Name = "Position Error : " + Ext.getCmp("incident_name_control").getValue();
    
    var incident_grid_Layer_Name = "Line Datum Grid : " + Ext.getCmp("incident_name_control").getValue();
    
    var vectorLayer = new OpenLayers.Layer.Vector(incident_Error_Layer_Name);

    var totalPositionError = CalculateMisObjectPosError();
    
   
    console.log( "Total Position Error:" + totalPositionError);
    
    var search_factor = parseFloat(Ext.getCmp("total_effort_allocation_optimal_search_factor").getValue());
    
    var  gridSystemInfo = findGridSystemUsingSearchFactor(search_factor);                                           

    var cellSizeFactor = findGridUnitWidthFactor(gridSystemInfo.grid_system);

    var unitCellFixedWidth = totalPositionError * cellSizeFactor;
    
    var theta = (Math.atan2((lastTwoPositions[3] - lastTwoPositions[1]),  (lastTwoPositions[2] - lastTwoPositions[0]))) *  (180/Math.PI);
                                                                      
    var normalizedTheta = theta<0?theta+360:theta;
    
    var last_segment_distance = Math.sqrt(Math.pow(lastTwoPositions[3]-lastTwoPositions[1],2) + Math.pow(lastTwoPositions[2]-lastTwoPositions[0],2));   
    
    
    
    var line_datum_pars = CalulatePerpendiculars(lastTwoPositions[0],lastTwoPositions[1],lastTwoPositions[2],lastTwoPositions[3],normalizedTheta,totalPositionError);
    
     var sendObj = {simulation_type:"LINE_DATUM",
                    simulation_data:{
                    segment_legth:last_segment_distance,
                    segment_direction:normalizedTheta,
                    position_error:totalPositionError,
                    search_factor:search_factor,
                    start_perp_X1:line_datum_pars.start_perp_X1,
                    start_perp_Y1:line_datum_pars.start_perp_Y1,
                    start_perp_X2:line_datum_pars.start_perp_X2,
                    start_perp_Y2:line_datum_pars.start_perp_Y2,
                    end_perp_X1:line_datum_pars.end_perp_X1,
                    end_perp_Y1:line_datum_pars.end_perp_Y1,
                    end_perp_X2:line_datum_pars.end_perp_X2,
                    end_perp_Y2:line_datum_pars.end_perp_Y2
            }          
        }
    SendRequestToGProcess(web_app_url + "/servlets_proxy.php","Simulation",sendObj,function(data){
        
           var geometryString = data.responseData;

           pointDatumResultProcessing(geometryString,incident_grid_Layer_Name);
        
             var grid_unit = mycircle.getBounds().toGeometry();

            var grid_unit_feature =  new OpenLayers.Feature.Vector(grid_unit);

            var centerCircle =new OpenLayers.Geometry.Point(lastTwoPositions[0],lastTwoPositions[1]);
    
            var mycircle = OpenLayers.Geometry.Polygon.createRegularPolygon
            (
                centerCircle,
                totalPositionError,
                40,
                0
            );
          
        
            var featurecircle = new OpenLayers.Feature.Vector(mycircle);

            var titleForPoint = Ext.getCmp("incident_name_control").getValue();

            var styleForPoint = new  SarisLabelPointStyle(titleForPoint);
            styleForPoint.fillColor= "#000000";

            var featurePoint = new OpenLayers.Feature.Vector(
                point,
                null,
               styleForPoint
            );

        
            vectorLayer.addFeatures([ featurecircle,featurePoint]);


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
    });
}
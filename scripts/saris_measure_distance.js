var measuredistance_units = 'km';

var measuredistance_labels=new OpenLayers.Layer.Vector("measuredistance_labels",{
		styleMap: new OpenLayers.StyleMap({
			'default':{ 
				fontColor: "${fontColor}",
				fillColor: "#FF5500",
				fontSize: "${fontSize}",
				fontFamily: "Tahoma",
				fillOpacity: 0,
				pointRadius: 1,
				pointerEvents: "visiblePainted",
				labelOutlineColor:"#FFFFFF",
				labelOutlineWidth:2,
				label : "${distance}" + "${units}"
			}
		})
	});

var measuredistance_cursor=new OpenLayers.Layer.Vector("measuredistance_cursor",{
		styleMap: new OpenLayers.StyleMap({
			'default':{
				fontColor: "${fontColor}",
				fillColor: "#FF9900",
				fontSize: "${fontSize}",
				fontFamily: "Tahoma",
				fillOpacity: 0,
				pointRadius: 1,
				pointerEvents: "visiblePainted",
				labelOutlineColor:"#FFFFFF",
				labelOutlineWidth:2,
				label : "${distance}" + "${units}"
			}
		})
	});
	
var measuredistance_layer=new OpenLayers.Layer.Vector("measuredistance_layer",{
		styleMap: new OpenLayers.StyleMap({
			'default':{
				fontColor: '${fontColor}',
				fontSize: "${fontSize}",
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
				label : "${distance}" + "${units}" + "  ${direction} °"
			}
		})
	});
	
var measuredistance_layer_style = {
		strokeColor:"#FF7700",
		fillOpacity: 0,
		pointRadius: 1,
		pointerEvents: "visiblePainted",
		strokeColor:"#FF7700",
		strokeWidth:2,
		strokeDashstyle:"dashdot",
	};
	
var measuredistance_distance=0;	

function rad(n) {
  return n * (Math.PI / 180);
}

function degrees(n) {
  return n * (180 / Math.PI);
}

function CalculateBearing(latFrom, lonFrom, latTo, lonTo) {
     
        var p1 =  new OpenLayers.LonLat(lonFrom,latFrom).transform("EPSG:3857", "EPSG:4326");

        var p2 =  new OpenLayers.LonLat(lonTo,latTo).transform("EPSG:3857", "EPSG:4326");

        var lon1 = p1.lon;
        var lat1 = p1.lat;
        var lon2 = p2.lon;
        var lat2 = p2.lat;
    
        var dLon = rad(lon2-lon1);
        var y = Math.sin(dLon) * Math.cos(rad(lat2));
        var x = Math.cos(rad(lat1))*Math.sin(rad(lat2)) - Math.sin(rad(lat1))*Math.cos(rad(lat2))*Math.cos(dLon);
        var brng =Math.atan2(x, y) * 180 / Math.PI;

        var result = ((brng + 360) % 360);
        
        return result.toFixed(2);
 
}

function TotalToUnits(measurement)
{

    if(SarisSettings.map.distance_metric_units=="m"){
						 return measurement;
    }
    else if (SarisSettings.map.distance_metric_units=="km"){
      
                         return measurement;
    }
    else if(SarisSettings.map.distance_metric_units=="nm"){
                         return (measurement*1000)* 0.000539957;   
    }
    else
    {
       
        return 0;
    }
}
function init_map_controls_measureDistance()
{
	
	measureDistanceTool=new OpenLayers.Control.Measure(OpenLayers.Handler.Path,{
			persist: false,
			geodesic: false,
			handlerOptions: {
				layerOptions: 
				{
					styleMap: new OpenLayers.StyleMap({
						strokeColor:"#FF7700",
						strokeWidth:2,
						strokeDashstyle:"dashdot",
						labelOutlineColor:"#FFFFFF",
						labelOutlineWidth:5
					})
				}
			},
			callbacks:{
				create:function()
				{
					try{
						
						map.removeLayer(measuredistance_labels);
	
						map.removeLayer(measuredistance_cursor);
						
					}catch(err){};
					
					measuredistance_distance = 0;
					
					if (map.getLayersByName("measuredistance_layer")=="")
					{
						map.addLayer(measuredistance_layer);
					}
					
					map.addLayer(measuredistance_labels);
	
					map.addLayer(measuredistance_cursor);
				},
				modify:function(_cursorPoint,evt)
				{
					if (this.geodesic==true)
					{
						var _v=evt.geometry.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
					}else{
                        
                        if(SarisSettings.map.distance_metric_units=="m")
						  var _v=evt.geometry.getLength();
                        else if (SarisSettings.map.distance_metric_units=="km")
                          var _v=evt.geometry.getLength()/1000;
                        else if(SarisSettings.map.distance_metric_units=="nm")
                          var _v=evt.geometry.getLength()* 0.000539957;
                        else{}
					}
					
					measuredistance_cursor.destroyFeatures();
					
					var _cursor = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_cursorPoint.x, _cursorPoint.y));
					
					if(evt.geometry.getVertices().length==2)
					{
						measuredistance_labels.destroyFeatures();
					}
					
					if (_v>0)
					{
						
					
						_cursor.attributes={
							distance: _v.toFixed(2),
							units:SarisSettings.map.distance_metric_units,
							fontColor: 'black',
							align: "cm",
							fontSize:"14px"
						}
						
						measuredistance_cursor.addFeatures([_cursor]);
					}
				}
			},
			eventListeners: {
				measure: function(evt)
				{
					var _v = evt.geometry.getVertices();
					
					if (_v.length>=2)
					{					
						var _preLastVertex = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point((_v[_v.length-1].x + _v[_v.length-2].x)/2, (_v[_v.length-1].y + _v[_v.length-2].y)/2));
			
						var _lastVertex = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_v[_v.length-1].x, _v[_v.length-1].y));
					
						var _segment = new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(_v[_v.length-2].x, _v[_v.length-2].y), new OpenLayers.Geometry.Point(_v[_v.length-1].x, _v[_v.length-1].y)]);
						
                        var seg_vertices = _segment.getVertices();
                                               
                        var _bearing = CalculateBearing(seg_vertices[0].x,seg_vertices[0].y,seg_vertices[seg_vertices.length-1].x, seg_vertices[seg_vertices.length-1].y);
                        
                        
						if (this.geodesic==true)
						{
							var measuredistance_distance_segment=_segment.getGeodesicLength(new OpenLayers.Projection(map_currentProjection));
						}else{
                            
                            var measuredistance_distance_segment=0;
                          
                            if(SarisSettings.map.distance_metric_units=="m")
						       measuredistance_distance_segment=evt.geometry.getLength();
                            else if (SarisSettings.map.distance_metric_units=="km")
                               measuredistance_distance_segment=evt.geometry.getLength()/1000;
                            else if(SarisSettings.map.distance_metric_units=="nm"){
                                measuredistance_distance_segment=evt.geometry.getLength()* 0.000539957;
                                }
                            else{}
                            
							//var measuredistance_distance_segment=_segment.getLength();
						}
					
						_preLastVertex.attributes={
							distance: measuredistance_distance_segment.toFixed(2),
							units:SarisSettings.map.distance_metric_units,
                            direction:_bearing,
							fontColor: '#808080',
							align: "cm",
							fontSize:"12px"
						};
					
						_lastVertex.attributes = {
							distance: TotalToUnits(evt.measure).toFixed(2),
                            direction:_bearing,
							units:SarisSettings.map.distance_metric_units,
							fontColor: '#FF6600',
							align: "cm",
							fontSize:"14px"
						};
						
						
						measuredistance_layer.addFeatures(new OpenLayers.Feature.Vector(evt.geometry,null,measuredistance_layer_style));
						
                        measuredistance_layer.addFeatures([_lastVertex.clone()]);
						//measuredistance_layer.addFeatures([_preLastVertex.clone(),_lastVertex.clone()]);
					}
					
				},
				measurepartial:function(evt)
				{
				
					var _v = evt.geometry.getVertices();
					
					if (_v.length>2)
					{					
						var _preLastVertex = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point((_v[_v.length-2].x + _v[_v.length-3].x)/2, (_v[_v.length-2].y + _v[_v.length-3].y)/2));
			
						var _lastVertex = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(_v[_v.length-1].x, _v[_v.length-1].y));
					
						var _segment = new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(_v[_v.length-3].x, _v[_v.length-3].y), new OpenLayers.Geometry.Point(_v[_v.length-2].x, _v[_v.length-2].y)]);
					   
                        var seg_vertices = _segment.getVertices();
                                               
                        var _bearing = CalculateBearing(seg_vertices[0].x,seg_vertices[0].y,seg_vertices[seg_vertices.length-1].x, seg_vertices[seg_vertices.length-1].y);
                        
						if (this.geodesic==true)
						{
							var measuredistance_distance_segment=_segment.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
						}else{
							//var measuredistance_distance_segment=_segment.getLength();
                            var measuredistance_distance_segment=0;
                            
                            if(measuredistance_units=="m")
						       measuredistance_distance_segment=evt.geometry.getLength();
                            else if (SarisSettings.map.distance_metric_units=="km")
                               measuredistance_distance_segment=evt.geometry.getLength()/1000;
                            else if(SarisSettings.map.distance_metric_units=="nm")
                               measuredistance_distance_segment=evt.geometry.getLength()* 0.000539957;
                            else{}
						}
					
						_preLastVertex.attributes={
							distance: measuredistance_distance_segment.toFixed(2),
							units:SarisSettings.map.distance_metric_units,
                            direction:_bearing,
							fontColor: '#808080',
							align: "cm",
							fontSize:"12px"
						};
					    console.log(evt);
						_lastVertex.attributes = {
							distance: TotalToUnits(evt.measure).toFixed(2),
							units:SarisSettings.map.distance_metric_units,
                            direction:_bearing,
							fontColor: '#FF6600',
							align: "cm",
							fontSize:"14px"
						};
						measuredistance_layer.addFeatures([_lastVertex.clone()]);
						//measuredistance_layer.addFeatures([_preLastVertex.clone(),_lastVertex.clone()]);
					}
				}
			}
		});
    
    map.addControl(measureDistanceTool);
    measureDistanceTool.activate();
}

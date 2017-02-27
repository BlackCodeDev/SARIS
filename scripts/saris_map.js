var map;
var map_previousProjection;
var map_currentProjection;
var map_highlightLayer;
var map_basemapProjections =[];
var map_controls=[];
var map_isGeodesic = true;
var baseLayerManager;
var clickCtl;
var map_clicked_lat=0;
var map_clicked_lon=0;

Proj4js.defs["EPSG:900913"]= "+title= Google Mercator EPSG:900913 +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
Proj4js.defs["EPSG:2100"] = "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs";
Proj4js.defs["EPSG:3857"]="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
Proj4js.defs["EPSG:32661"] = "+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
Proj4js.defs["EPSG:4258"] = "+proj=longlat +ellps=GRS80 +no_defs";
Proj4js.defs["EPSG:32717"] = "+proj=utm +zone=17 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
Proj4js.defs["EPSG:3035"] = "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs";

function PadZero(val){
    if(Math.abs(val)<10){
        return "0" + val;
    }
}

function mapGetCountOfOverlayers()
{
	return mapGetlayersBy("isBaseLayer",false).length;
}

function mapGetlayersBy(_find,_value)
{
	var _array=[];

	var _layers=map.getLayersBy(_find,_value);
	
	for(var i=0;i<_layers.length;i++)
	{		
			_array.push(_layers[i]);
	}

	return _array;
}

function mapChangeLayerVisibility(_layerId,_visibility)
{
	var focusedLayer = map.getLayer(_layerId);
    focusedLayer.setVisibility(_visibility);
	
}
function init_map()
{
	    
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
	
	OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
	
	OpenLayers.Util.onImageLoadErrorColor = 'transparent';
    
    OpenLayers.ProxyHost = "proxy.php?url=";
    
    map = new OpenLayers.Map('map_area',
                             {
                              projection: new OpenLayers.Projection(SarisSettings.map.mapProj),
                              displayProjection: new OpenLayers.Projection(SarisSettings.map.displayProj)
                             });
    
    baseLayerManager =  new BaseMapManager(map);
    baseLayerManager.Initialize();   
  
    map.setCenter(
        new OpenLayers.LonLat(24.45, 37.8).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 6
    );    
    
   
    map.addControl( new OpenLayers.Control.LayerSwitcher() );
    Ext.getCmp('map_bbar_scale_label').setText(" Scale 1 : " + Math.ceil(map.getScale()));
    map.addControl(
    new OpenLayers.Control.MousePosition({
        prefix: '<div style=\"color: green; font-size: 14px; font-weight: bold; background-color: white; width: 500px; text-align: left;\"> Coordinates: ',
        suffix:'</div>',
        separator: ' | ',
        numDigits: 7,
        projection: 'EPSG:4326',
        formatOutput:function(lonLat){
            
                var latTransformed, lonTransformed, s;

                var selectedFormat = SarisSettings.map.coordinatesFormat;

                if (selectedFormat == "DMS"){
                lonTransformed = convertDDToDMS(lonLat.lon,true);
                latTransformed =convertDDToDMS(lonLat.lat);
                s = lonTransformed.deg + " " + lonTransformed.min + " " + lonTransformed.sec + " " + lonTransformed.dir + " : " +
                   latTransformed.deg + " " +  latTransformed.min + " " +  latTransformed.sec + " " + latTransformed.dir  ;
                }
                else if(selectedFormat == "DM"){
                  lonTransformed= convertDDToDMM(lonLat.lon,true);
                  latTransformed =convertDDToDMM(lonLat.lat);
                  s = lonTransformed.deg + " " + lonTransformed.min + lonTransformed.dir + " : " + latTransformed.deg + " " + latTransformed.min + " " + latTransformed.dir;
                }
                else{
                    s = lonLat.lon.toFixed(5)  + " " + lonLat.lat.toFixed(5);
                }



                var result = '<div style=\"color: black; font-size: 11px; font-weight: bold; width: 500px; text-align: left;\"> Coordinates: ' + s + "</div";
                Ext.getCmp('map_bbar_coords_label').setText(result);

                return "";

            },
            emptyString: 'Mouse not over map'
    }));
   
    
        map.events.register("zoomend", map, function(){
               Ext.getCmp('map_bbar_scale_label').setText(" Scale 1 : " + Math.ceil(map.getScale()));
        });    
    
      
  
}
function findLayerPropertiesFromStore(layer_name,service_name){
  //debugger;
    for(var i in map_layers_store){
       var item = map_layers_store[i];
       
       if(layer_name==item.name && service_name== item.serviceName){
         
           return item;
           
       }
          
    }
}

function init_registered_serv_layers_store(){
         for(var i in saris_registered_services){
            GetCapabilities(saris_registered_services[i]);
         }
}
        
function init_predefined_layers(){
   for(var i in saris_registered_services){
       var service_predefined_layers = saris_registered_services[i].service_predifened_layers;
       for(var j in service_predefined_layers){
           var predefinedLayer =  service_predefined_layers[j];
           //console.log(predefinedLayer);
           
                    
            var layerPropertyInfo =  findLayerPropertiesFromStore(predefinedLayer,saris_registered_services[i].service_name);
            if(layerPropertyInfo){
                console.log(layerPropertyInfo);
                //var loaderLayer =  new SarisMapLayerLoader();
                var loaderLayer =  new SarisMapLayerLoader(layerPropertyInfo);
                //(url,layer,type,server_type

                loaderLayer.Load();
            }
               
          
       }
       
   } 
}
 OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
                    defaultHandlerOptions: {
                        'single': true,
                        'double': false,
                        'pixelTolerance': 0,
                        'stopSingle': false,
                        'stopDouble': false
                    },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.trigger
                        }, this.handlerOptions
                    );
                }, 
                callback_fn:null,
                trigger: function(e) {
                    var lonlat = map.getLonLatFromPixel(e.xy);
                    if(this.callback_fn){
                        this.callback_fn(lonlat);
                    }
                  
                    //map_clicked_lat =  lonlat.lat;
                    //map_clicked_lon = lonlat.lon;
                }});

                                            
Ext.onReady(function()
{
    init_map();
    init_registered_serv_layers_store();
    init_predefined_layers();
    
    clickCtl = new OpenLayers.Control.Click();
    map.addControl(clickCtl);
    
      
  
    
});
var map_layers_store =[];

var map_simulation_layers_store=[];

function LoadLayerFromGeoserver(obj){
    //console.log(arguments);
    //console.log(obj.name.split(":")[0]);
     switch(obj.serviceType.toUpperCase()){
         case "WMS":
         
           var layerToAdd=  new OpenLayers.Layer.WMS( obj.title,obj.serviceUrl, {layers: obj.name,transparent: true,format: "image/png",
                        transitionEffect:null,
                        tiled:false,
                        projSrs:"EPSG:900913"},
                        {isBaseLayer:false} 
                    );
             
               map.addLayers([layerToAdd]);
             
               AddLayerToTree(layerToAdd,obj);
            
            
         case "WFS":
             return null;
         case "WMTS":
             return null;
         default:
             return null;  
     }
  
}

function GetCapabilities(registered_service_object)
{
    var request = new XMLHttpRequest();
    request.open("GET",web_app_url + "/modules/wms.php?url=" + registered_service_object.service_url, false);
    request.send();
    var xml = request.responseXML;
   
    try{
      var obj = new OpenLayers.Format.WMSCapabilities().read(xml);
      var capability = obj.capability;
      for (var i=0, len=capability.layers.length; i<len; i++) {
          
          if(i==0)
            console.log(capability.layers[i])
            
            var map_layer_to_store =  {
                                        title:capability.layers[i].title,
                                        name:capability.layers[i].name,
                                        bbox:capability.layers[i].bbox["CRS:84"],
                                        serviceUrl:registered_service_object.service_url,
                                        serviceName:registered_service_object.service_name,
                                        serviceType:registered_service_object.service_type,
                                        serviceServerType: registered_service_object.service_server_type,
                                        legendImage:capability.layers[i].styles[0].legend
        }
        map_layers_store.push(map_layer_to_store);
        //console.log(map_layers_store);
      //var layerObj = capability.layers[i];
      //if (layerObj.name === myLayerName) {
    //      map.zoomToExtent(OpenLayers.Bounds.fromArray(layerObj.llbbox));
          //break;
      }
    }
    catch(err){}
 }


function AddLayerToTree(layer,obj){
    var _node=saris_layer_tree_panel_tree_json_store.getNodeById('maptab_west_layer_tree_panel_tabs_layers_layers_node');
    maptab_west_layer_add_layer(layer,_node,obj);
}

function LoadLayerFromArcGisServer(url,layer,type){
    console.log(arguments);
    return "arcgis server";
}

var LoaderDispatchers = [{serverType:"ArgisServer",LoaderFunc:LoadLayerFromArcGisServer},
                         {serverType:"Geoserver",LoaderFunc:LoadLayerFromGeoserver}];

function SarisMapLayerLoader(layer_info_object)
{
   // layerPropertyInfo.serviceUrl,layerPropertyInfo.name, layerPropertyInfo.serviceType,layerPropertyInfo.serviceServerType
    var serverType;
    
    this.URL = layer_info_object.serviceUrl;
    this.LAYER = layer_info_object.name;
    this.TITLE = layer_info_object.title;
    this.TYPE = layer_info_object.serviceType;
    this.SERVERTYPE = layer_info_object.serviceServerType;
    this.Load = function(){
       
        var dispFunction = GetDispatcher(this.SERVERTYPE);
        console.log(dispFunction);
        dispFunction.LoaderFunc(layer_info_object);
    }
    
    function GetDispatcher(dipName)
    {
        for(var i in LoaderDispatchers)
        {
            //console.log([LoaderDispatchers[i].serverType,dipName]);
            if(dipName == LoaderDispatchers[i].serverType)
                return LoaderDispatchers[i];
        }
    }
}
    


    


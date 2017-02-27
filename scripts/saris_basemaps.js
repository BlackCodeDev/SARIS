var basemapLayers = [{
    name:"OSM Map",
    layer: new OpenLayers.Layer.OSM(this.name)
}]

function BaseMapManager(map){
    this._map = map;
    this.Initialize=function(){
        for (var i=0;i<basemapLayers.length;i++){
            map.addLayer(basemapLayers[i].layer);
            maptab_west_layer_add_BaseLayer(basemapLayers[i].layer,saris_layer_tree_panel_tree_json_store.getNodeById('maptab_west_layer_tree_panel_tabs_layers_basemaps_node'));
        }
    }
    this.GetByLayerName = function(name){
        for(var i in map.layers){
            if(map.layers[i]==name && map.layers[i].isBaseLayer){
                return map.layers[i];
            }
        }
    }
}

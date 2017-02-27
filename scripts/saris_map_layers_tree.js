var saris_layer_tree_panel_tree_json_store=Ext.create('Ext.data.TreeStore', {
	fields: ['text','layerObject'],
	root: {
		text: 'root',
		children: [
			{
				text:"<b>Base Maps</b>",
				id:'maptab_west_layer_tree_panel_tabs_layers_basemaps_node',
				expanded: true
			},{
				text:"<b>Overlays</b>",
				id:'maptab_west_layer_tree_panel_tabs_layers_layers_node',
				expanded: true,
				checked:true
			}	
		]
	}
});


 
var map_layers_tree={
	xtype: 'tree-panel',
	rootVisible: false,
	id:'map_layers_tree',
	border:false,
	multiSelect: true,
    tbar:[{
		xtype:'button',
		id:'add_layer_service',
		name:'add_layer_service',
		iconCls:'maptab_services_manager_register',
		tooltip:"Add Layer",
		handler:function(){      
            
            var store = Ext.create('Ext.data.Store', {
                                    storeId:'service_store_layers',
                                    fields:['service','title','layerObj'],
                                    listeners: {
                                        load: function(store, records, successful, eOpts){
                                            store.add(function() {
                                            var data = [];
                                        for(var i=0;i<map_layers_store.length;i++){
                                            data.push({
                                                service: map_layers_store[i].serviceName,
                                                title: map_layers_store[i].title,
                                                layerObj: JSON.stringify(map_layers_store[i]),

                                                }
                                             );
                                        }                                                                  
                                        return data;}());
                                    }
                                        }
                                }); 

            var grid = Ext.create('Ext.grid.Panel', {
                    title: 'Layers',
                    store: Ext.data.StoreManager.lookup('service_store_layers'),
                    columns: [
                       { text: 'Service',  dataIndex: 'service'},
                       { text: 'Title', dataIndex: 'title', flex: 1 },                                                     
                       { text: 'layerObj', dataIndex: 'layerObj',hidden:true},
                    ],
                    height: 320,
                    width: 400,
                });

              store.load();

              var map_services_grid_window = new Ext.Window({
                            id     : 'map_services_grid_window',
                            height : 400,
                            width  : 500,
                            items  : [{
                                xtype:"panel",
                                layout:'fit',
                                items:[grid],
                                bbar:[{
                                    xtype:"button",
                                    text:"Add",
                                    handler:function(){                                  
                                        var layerSelected = grid.getSelectionModel().getSelection()[0].data.layerObj;
                                        var ob = JSON.parse(layerSelected);
                                        var loaderLayer =  new SarisMapLayerLoader(ob);
                                        loaderLayer.Load();                                    
                                    }
                                }]
                            }]
                        });

                 map_services_grid_window.show();
        }
         
        
     },],
    plugins: [
    ],
	viewConfig: {
		markDirty:false,
        plugins: {
            ptype: 'treeviewdragdrop'
        },
		listeners:{
			drop:function()
			{
				reorderLayers();
			}
		}
    },
	listeners: {
		checkchange:function(node, checked)
		{
			maptab_west_layer_check_node(node,checked);
		},
		itemcontextmenu:function(tree, node, item, index, e, eOpts)
		{
           
            var menu_grid = new Ext.menu.Menu({ items:
            [
                { text: 'Remove', 
                  handler: function() { 
                    var tree_node_layer = map.getLayer(node.data.id);
                    map.removeLayer(tree_node_layer);
                    node.remove();
                  }
                },
                { text: 'Zoom To Layer', handler: function() {
                    
                    var layerBounds;
                    
                    var layerServiceType = node.data.layerObject.serviceType;
                    
                    if(layerServiceType != "SVS")
                        {
                            var coordinateSystem = MapCRSToEPSG(node.data.layerObject.bbox.srs);
                            var extent = node.data.layerObject.bbox.bbox;
                            var nativeBounds = OpenLayers.Bounds.fromArray(extent);
                            var transformedBounds = nativeBounds.transform(new OpenLayers.Projection(coordinateSystem), map.getProjectionObject());
                            layerBounds =transformedBounds
                        }                    
                    else
                        {
                            layerBounds = node.data.layerObject.bbox
                        }
                   
                    map.zoomToExtent(layerBounds);
                    //console.log(node.data.layerObject.bbox);
                }},
                {
                    text: 'Export', 
                    handler: function(){
                        var layerServiceType = node.data.layerObject.serviceType;
                         if(layerServiceType != "SVS"){
                             alert("Not Pemited")
                         }
                        else{
                             showDownloadDialog(node);
                             //console.log(result);
                            //TO DO IMPLEMENT EXPORT IMAGE /SHP
                        }
                    }
                }
            ]
            });
          var position = e.getXY();
          e.stopEvent();
          menu_grid.showAt(position);
            
		
		}
	},
	store:saris_layer_tree_panel_tree_json_store,
	columns: [
	{
		xtype: 'treecolumn',
		dataIndex: 'text',
		autoSizeColumn: true,
		flex:2,
		editor:{
			xtype:"textfield",
			allowBlank: false
        }
	},
    ]
};

function maptab_west_layer_add_BaseLayer(_layer,_node)
{
	_node.insertBefore({
		id: _layer.id,
		text:_layer.name,
		leaf: true,
		icon:_layer.icon,
		iconCls:'maptab_services_manager_layer_legend_size',
		checked: _layer.visibility,
		tools: "",
	},_node.firstChild);
}

function maptab_west_layer_add_layer(_layer,_node,_layerObj)
{
	_node.insertBefore({
		id: _layer.id,
		text:_layer.name,
		leaf: true,
		qtip:'<img src=\"'+_layerObj.legendImage.href+'\">',
		icon:_layerObj.legendImage.href,
		iconCls:'maptab_services_manager_layer_legend_size',
		checked:true,// _layer.visibility,
		tools: "",
        layerObject:_layerObj
	},_node.firstChild);
	
	return _node;
}

function maptab_west_layer_check_node(_node,checked)
{
	if (_node.hasChildNodes())
	{
        alert("go to childs");
		Ext.each(_node.childNodes,function(item)
		{
			maptab_west_layer_check_node(item,checked);
		});
	}
	
	if(_node.isLeaf())
	{
		mapChangeLayerVisibility(_node.data.id,checked);
	}
    
	_node.set('checked',checked);	
}

function reorderLayers()
{	
	var _index = mapGetCountOfOverlayers();
	
	var _node=saris_layer_tree_panel_tree_json_store.getNodeById('maptab_west_layer_tree_panel_tabs_layers_layers_node');
	
	_node.cascadeBy(function(node){
            if(node.isLeaf())
            {
               var _lay = map.getLayer(node.data.id);

                map.setLayerIndex(_lay,_index);

                _index--;
            }
	});
	
}

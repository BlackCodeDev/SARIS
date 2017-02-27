var map_bbar_items = {
    xtype: 'toolbar',
    border: false,
    items: [{
        xtype: 'tbtext',
        id:"map_bbar_coords_label",
        text: ''
    },  {
        xtype: 'tbtext',
        id:"map_bbar_scale_label",
        text: ''
    }]
};
var maptab_center_area_ui={
	xtype:'panel',
	layout:'border',
	items:[
		{
			xtype:'panel',
			region:'center',
			id:'maptab_map_center',
			layout:'fit',
            html:'<div id=\'map_area\' style=\'width:100%;height:100%\'>',
            tbar:map_main_toolbar_items,
            bbar:[map_bbar_items],
			border:false,           
        },
        {
			xtype:'panel',
			region:'east',
			id:'maptab_map_east',
			layout:'border',
			border:false,
            items:[]
        },
        {
			xtype:'panel',
			region:'west',
			id:'maptab_map_west',
			layout:'border',
			border:false,
            items:[]
        },
         {
			xtype:'panel',
			region:'north',
			id:'maptab_map_north',
			layout:'border',
			border:false,
            items:[]
        }
		
	]
};

var map_tab_ui={
	xtype:'panel',
	layout:'border',
	border:false,
	items:[
		{
			xtype:'panel',
			region:'center',
			border:false,
			layout:'fit',
			items:[maptab_center_area_ui]//
		},
        {
			xtype:'panel',
			region:'north',
			border:false,
            hidden:true
		},
         {
			xtype:'panel',
			region:'south',
			border:false,
            hidden:true
		},
		{
			xtype:'panel',
			id:'maptab_west',
            split:true,
			region:'west',
			plain:true,
            border:false,
			title:"",//"",
			width:420,
           
			
			items:[   {
                            xtype:'panel',
                            id:'maptab_west_legend_panel',
                            height:400,
                            autoScroll: true,
                            title:"Legend",
                
                            //iconCls:'maptab_accordion_icon',
                            items:[map_layers_tree]
                        },                       	
						{
                            xtype:'panel',
                            id:'maptab_west_general_panel',
                            title:"Map Settings",
                          // iconCls:'maptab_accordion_icon',
                            height:200,
                            items:[{
                                xtype       : 'form',                         
                                autoScroll  : true,
                                id          : 'formpanel',
                                defaultType : 'field',
                                 height:200,
                                frame       : true,
                                title       : '',
                                items       : [
                                        {
                                        xtype: 'combo',
                                        width:400,
                                        id:"map_tab_west_general_settings_coord_display_format",
                                        fieldLabel: 'Coordinates Format',
                                        hiddenName: 'coordinatesFormat',
                                        store: new Ext.data.SimpleStore({
                                            data: [
                                                ['DD', 'Decimal Degrees'],
                                                ['DM', 'Decimal Minutes'],
                                                ['DMS', 'Degrees Minutes Seconds']                                            
                                            ],
                                            id: 0,
                                            fields: ['value', 'text']
                                        }),
                                        valueField: 'value',
                                        displayField: 'text',
                                        triggerAction: 'all',
                                        editable: false,
                                        value:SarisSettings.map.coordinatesFormat,
                                        listeners: { 
                                        select: function(combo, records) {
                                            SarisSettings.map.coordinatesFormat = combo.getValue();                                       
                                       }
                                    }},
                                     {
                                        xtype: 'combo',
                                        width:400,
                                        id:"map_tab_west_general_settings_distance_metric_units",
                                        fieldLabel: 'Distance Metric Units',
                                        hiddenName: 'distMetricUnits',
                                        store: new Ext.data.SimpleStore({
                                            data: [
                                                ['km', 'Kilometers'],
                                                ['nm', 'Nautical Miles']                                           
                                            ],
                                            id: 0,
                                            fields: ['value', 'text']
                                        }),
                                        valueField: 'value',
                                        displayField: 'text',
                                        triggerAction: 'all',
                                        editable: false,
                                        value:SarisSettings.map.distance_metric_units,
                                        listeners: { 
                                        select: function(combo, records) {
                                            alert(combo.getValue());
                                            SarisSettings.map.distance_metric_units = combo.getValue();                                       
                                       }
                                    }}
                                ]}]
                            },
                       
                        
				//maptab_west_layer_tree_panel,
				//maptab_west_selection_panel,
				//maptab_west_general_settings_panel
			]
		}
	]
};
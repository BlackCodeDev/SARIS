Ext.require(['*']);

TabsViewportUi = Ext.extend(Ext.Viewport, {
    layout: 'border',
    initComponent: function() {
        this.items =[
			{
				xtype:'panel',
				region:'north',
				id:'viewport_north',
				border:false,
				bodyStyle:{"background-color":"#e3e3e3"},
				height:100,
				html:'<img src="images/Hellenic_Coast_Guard_logo.png" style="position: absolute;left:0px;" /><span style="position: absolute;left:450px;top:40px;font-size:20px" ><b>SARIS SEARCH AND RESCUE INFORMATION SYSTEM</b></span>'
			},
			{
				xtype:'tabpanel',
				id:'viewport_center',
				border:false,
				region:'center',
				listeners:{
				    'tabchange':function(){
						//try{map.updateSize();}catch(err){}
						//try{metadata_map.updateSize();}catch(err){}
				    }
				},
				items:[
					
					{
						xtype:'panel',
						title:"Map",
						id:'viewport_maptab',
						border:false,
						layout:'fit',
						items:[map_tab_ui]
					}
				]
			}
		];
		
		TabsViewportUi.superclass.initComponent.call(this);
    }
	
});


Ext.onReady(function() {

    Ext.QuickTips.init();
	Ext.override(Ext.grid.View, { enableTextSelection: true });
    var cmp1 = new TabsViewport({
        renderTo: Ext.getBody()
    });
	
    cmp1.show();
});
 

TabsViewport = Ext.extend(TabsViewportUi, {
    initComponent: function() {
        TabsViewport.superclass.initComponent.call(this);
		
    }
});
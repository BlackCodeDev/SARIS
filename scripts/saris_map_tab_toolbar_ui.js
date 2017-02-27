var zoomInTool,panTool,measureDistanceTool;

var map_main_toolbar_items=[
{
		xtype:'button',
		id:'maptab_toolbar_general_pan',
		iconCls:'maptab_toolbar_general_pan',
		enableToggle: true,
		pressed:true,
		hidden:true,
		tooltip:'Pan',
		toggleHandler:function(item,state){

			
			//fn_toggleControl('navigation',state);
		}
	},
	{xtype: 'tbseparator'},
	{
		xtype:'button',
		id:'maptab_toolbar_general_zoomIn',
		iconCls:'maptab_toolbar_general_zoomIn',
		tooltip:"Zoom In",
		handler:function(){
			
			map.zoomIn();
		}
	},
	{
		xtype:'button',
		id:'maptab_toolbar_general_zoomOut',
		iconCls:'maptab_toolbar_general_zoomOut',
		tooltip:"Zoom Out",
		handler:function(){
			
			map.zoomOut();
		}
	},
	{
		xtype:'button',
		id:'maptab_toolbar_general_zoomByArea',
		iconCls:'maptab_toolbar_general_zoomByArea',
		enableToggle: true,
		toggleGroup:'map_navigation_tools',
		//tooltip:_maptab_toolbar_general_zoomByArea,
		toggleHandler :function(btn,pressed){
            if (btn.pressed)
			{
                zoomInTool=new OpenLayers.Control.ZoomBox();

                map.addControl(zoomInTool);
				
				zoomInTool.activate();
			}
			else
			{
				zoomInTool.deactivate();
			}
        }
			//fn_toggleControl('zoomByArea',state);
		
	},
    {
		xtype:'button',
		id:'maptab_toolbar_general_panTool',
		iconCls:'maptab_toolbar_navigation',
		enableToggle: true,
		toggleGroup:'map_navigation_tools',
		//tooltip:_maptab_toolbar_general_zoomByArea,
		toggleHandler:function(btn,pressed)
		{
			
			if (btn.pressed)
			{
				if (typeof panTool==="undefined")
				{
					panTool=new OpenLayers.Control.Pan();
					
					map.addControl(panTool);
				}
				
				panTool.activate();
			}
			else
			{
				panTool.deactivate();
			}
			
		}
			//fn_toggleControl('zoomByArea',state);
     },
     {
		xtype:'button',
		id:'maptab_toolbar_general_measure_distance',
		iconCls:'maptab_toolbar_general_measureDistance',
       // text:"Distance",
		enableToggle: true,
		toggleGroup:'map_navigation_tools',
		//tooltip:_maptab_toolbar_general_zoomByArea,
		toggleHandler:function(btn,pressed)
		{
			
			if (btn.pressed)
			{
                 init_map_controls_measureDistance();
				
			}
			else
			{
				measureDistanceTool.deactivate();
			}
			
		}
			//fn_toggleControl('zoomByArea',state);
      },
      {
		xtype:'button',
		id:'maptab_toolbar_general_draw_point',
		iconCls:'maptab_toolbar_draw_point',
        //text:"Draw Annotation",
        enableToggle: true,
		toggleGroup:'map_navigation_tools',
		//tooltip:_maptab_toolbar_general_zoomByArea,
		toggleHandler:function(){
          // Ext.getCmp(id).toggle(false)
            
            drawPointOnMap("draw");
        }
      },
      {
		xtype:'button',
		id:'maptab_toolbar_general_draw_point_from_coords',
		 iconCls:'maptab_toolbar_add_annotation',
        //text:"Draw Annotation From Coords",
		//tooltip:_maptab_toolbar_general_zoomByArea,
		handler:function(){
        
            
              annotationTool.deactivate();
              drawPointOnMap("text");
        }
      },
     {
		xtype:'button',
		id:'maptab_toolbar_general_remove_annotations',
       
        hidden:true,
		//iconCls:'maptab_toolbar_navigation',
        text:"Remove",
		//tooltip:_maptab_toolbar_general_zoomByArea,
		handler:function(){
            annotationTool.deactivate();
            //var controlSelection = new OpenLayers.Control.SelectFeature(map_user_points, {clickout: true});
           
            controlSelection.activate();

         }
      },
     {
		xtype:'button',
		id:'maptab_toolbar_general_add_waypointz',
		iconCls:'maptab_toolbar_add_route',
		//tooltip:_maptab_toolbar_general_zoomByArea,
		handler:function(){
            addWaypoints();               
         }
      },
     {
		xtype:'button',
		id:'maptab_toolbar_general_query_layers',
		iconCls:'maptab_toolbar_general_featureInfo',
        //text:"Info Tool",
		//tooltip:_maptab_toolbar_general_zoomByArea,
		handler:function(){
            map.addControl(getInfo);
            getInfo.activate();
         }
      },
     {
		xtype:'button',
		id:'cotrol_print',
		name:'cotrol_print',
		iconCls:'maptab_toolbar_general_print',
		tooltip:"Print",
		handler:function(){
            
            html2canvas(map.div, {
                    "useCORS": true,
                    "logging": true, //Enable log (use Web Console for get Errors and Warnings)
                    "proxy":"html2canvasproxy.php",
                    "onrendered": function(canvas) {
                        var img = new Image();
                        img.onload = function() {
                            img.onload = null;
                            document.body.appendChild(img);
                        };
                        img.onerror = function() {
                            img.onerror = null;
                            if(window.console.log) {
                                window.console.log("Not loaded image from canvas.toDataURL");
                            } else {
                                alert("Not loaded image from canvas.toDataURL");
                            }
                        };
                       img = canvas.toDataURL("image/png");
                        //var printWindow = window.open(img); 
                        var map_size = map.size;
		                var window_dimensions ='height='+map_size.h + ',width='+map_size.w;
                        myWindow = window.open("data:text/html," + encodeURIComponent("<img id='Image' src=" + img + " style='width:100%;'></img>"), "_blank",window_dimensions);
                        myWindow.focus();
                        myWindow.print();
		
                        
                        
                                }
                            });
		/*
		  var html2obj = html2canvas(map.div);
                var queue  = html2obj.parse();
                var canvas = html2obj.render(queue);
                var img = canvas.toDataURL();
                window.open(img);
                */
		
		//var mapdiv = map.div;
		
		//var content = document.getElementById(mapdiv.id); //has to be first.
		
		//-------------------
		 
		//--------------------
		//var map_size = map.size;
		//var window_dimensions ='height='+map_size.h + ',width='+map_size.w;
		//myWindow = window.open("data:text/html," + encodeURIComponent(content.innerHTML),
                      // "_blank",window_dimensions);
		//myWindow.focus();
		//myWindow.print();
		
		//var win = window.open();
		//win.document.write(content);
		//win.print();
		//win.close();
		
		
		}
	},
    {
        xtype:"tbseparator"
    },
   {
        text: 'Saris Simulations',                      
        menu: {
                xtype: 'menu',                          
                items: [
                        {
                            text: 'Datum Simulation',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                    text: 'Load Simulation',
                                    handler(){
                                        LoadSavedIncidents();
                                    }
                                },
                                {
                                    text: 'Create New Datum Simulation',
                                    id:"map_point_datun_definition",
                                    handler:function(){
                                        show_datum_Window();
                                    }
                                }]
                            }
                        }, 
                        {
                            text: 'Monte Carlo Simulation',
                            handler:function(){
                                showMonteCarloWindow();
                            }
                        },
                       
                ]                          
            }
   },
    {
        text: 'Search Area Coverage',                      
        menu: {
                xtype: 'menu',                          
                items: [
                        {
                            text: 'Create Search Area Plan',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                    text: 'Saris Area Coverage',
                                    handler(){
                                        showSearchPlanWindow()
                                    }
                                },
                                {
                                    text: 'Draw Search Area Coverage',
                                    handler:function(){
                                    }
                                }]
                            }
                        }, 
                        {
                            text: 'Load Search Plan',
                            handler:function(){
                                //showMonteCarloWindow();
                            }
                        },
                       
                ]                          
            }
   }
];


var map_main_toolbar =
{
			xtype:'toolbar',
			id:'map_tab_toolbar',
			items:[map_main_toolbar_items]
			//_maptab_maptab_north_tabpanel_navigation""
	
};
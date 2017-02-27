var select_annotations_control;





var SarisLabelPointStyle = function (labelInput) {   
                        this.strokeColor = "#00FF00";
                        this.strokeOpacity = 1;
                        this.strokeWidth = 3;
                        this.fillColor = "#FF5500",
                        this.fillOpacity = 0.5,
                        this.pointRadius = 6;
                        this.label = labelInput || "";
                                                
                        this.fontColor = "blue";
                        this.fontSize = "12px";
                        this.fontFamily = "Courier New, monospace";
                        this.fontWeight= "bold";
                        this.labelXOffset = "12";
                        this.labelYOffset=  "11";
                        this.labelOutlineColor = "white";
                        this.labelOutlineWidth = 3;
                    };

function featureAdded(evt){
    
        var map_user_points_form =  {
                xtype       : 'form',
                height      : 125,
                autoScroll  : true,
                id          : 'map_user_points_form',
                defaultType : 'field',
                frame       : true,
                title       : 'Add Point',
                items       : [
                    {
                        fieldLabel:'Title',
                        id:"map_user_points_form_title"
                    },

                    {
                        fieldLabel : 'Remarks'
                    },

                ],
            buttons:[
                {
                    text:"OK",
                    handler:function(){

                        var title = Ext.getCmp("map_user_points_form_title").getValue();

                        evt.feature.style = new SarisLabelPointStyle(title);                  

                        map_user_points.redraw();

                        map_user_points_form_window.close();
                        
                        //Ext.getCmp("maptab_toolbar_general_remove_annotations").setVisible(true);
                    }
                }
            ]
    };
    
    var map_user_points_form_window = new Ext.Window({
        id     : 'map_user_points_form_window',
        height : 155,
        width  : 400,
        items  : [map_user_points_form]
    });
    
    map_user_points_form_window.show();
}


function drawPointOnMap(args){
    
    if(args=="draw") {       
        annotationTool.activate();   
    }
    else {
        
       var map_user_point_form_with_coords = {
                xtype       : 'form',
                height      : 210,
                autoScroll  : true,
                id          : 'map_user_points_form',
                defaultType : 'field',
                frame       : true,
                title       : 'Add Point',
                items       : [
                    {
                        fieldLabel:'Title',
                        id:"map_user_point_form_with_coords_title"
                    },
                    {
                       fieldLabel:'Longitude',
                       id:"map_user_point_form_with_coords_lon"
                    },
                    {
                       fieldLabel:'Latitude',
                       id:"map_user_point_form_with_coords_lat"
                    },

                ],
                buttons:[
                    {
                        text:"OK",
                        handler:function(){

                            var title = Ext.getCmp("map_user_point_form_with_coords_title").getValue();
                            var lonC = Ext.getCmp("map_user_point_form_with_coords_lon").getValue();
                            var latC = Ext.getCmp("map_user_point_form_with_coords_lat").getValue();


                            var newPointFromText =  new OpenLayers.Geometry.Point(lonC, latC);
                            var newPointFromTextTransformed = newPointFromText.transform( "EPSG:4326", "EPSG:900913");


                            var newFeature =  new OpenLayers.Feature.Vector(newPointFromTextTransformed,null,new SarisLabelPointStyle(title));


                            map_user_points.addFeatures(newFeature)

                            map_user_points.redraw();
                            var tPoint =new OpenLayers.LonLat(lonC,latC).transform( "EPSG:4326", "EPSG:900913");
                            map.setCenter(tPoint,10);

                            map_user_points_form_window_from_coords.close();
                        }
                    }
                ]
            };
    
        var map_user_points_form_window_from_coords = new Ext.Window({
                id     : 'map_user_points_form_window',
                height : 260,
                width  : 400,
                items  : [map_user_point_form_with_coords]
            });


        map_user_points_form_window_from_coords.show();
    }
};                     

var map_user_points=new OpenLayers.Layer.Vector("Map Annotations",{styleMap: new OpenLayers.StyleMap({'default':new SarisLabelPointStyle()})});

var annotationTool = new OpenLayers.Control.DrawFeature(map_user_points,
                        OpenLayers.Handler.Point);


Ext.onReady(function()
{       
        map.addLayer(map_user_points);
        map.addControl(annotationTool);        
        annotationTool.events.register("featureadded", map_user_points, featureAdded);

 /*
        select_annotations_control  = new OpenLayers.Control.SelectFeature(map_user_points, {
           hover: true
        });
        map.addControl(select_annotations_control);
        selectControl.events.register('featurehighlighted', null, onFeatureHighlighted);
        */
});
 


<! DOCTYPE html>
<html lang="en">
<head>
<?php include 'config.php'; ?>
<meta charset="UTF-8" />
<title>SARIS</title>
<link rel="stylesheet" type='text/css' href="<?php echo $web_app_url?>/styles/main.css"/>
<link rel="stylesheet" type='text/css' href="<?php echo $web_app_url?>/styles/map_toolbar.css"/>
 <!--frameworks css-->
<link rel="stylesheet" type='text/css' href="<?php echo $web_app_url?>/jslibs/extjs/resources/css/ext-all.css"/>
<link rel="stylesheet" type='text/css'  href="<?php echo $web_app_url?>/jslibs/extjs/resources/ext-theme-gray/ext-theme-gray-all.css"/>
<link rel="stylesheet" type='text/css'  href="<?php echo $web_app_url?>/jslibs/extjs/plugins/boxselect/BoxSelect.css"/> 
<!--frameworks js-->

<script>
<?php echo "var web_app_url='$web_app_url';"; ?>
<?php echo "var servlets_server_url='$servlets_server_url';"; ?>

</script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/extjs/ext-all.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/proj4js/lib/proj4js-combined.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/OpenLayers/OpenLayers.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/OpenLayers/lib/OpenLayers/Control/ScaleBar.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/OpenLayers/lib/OpenLayers/Handler/Path.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/OpenLayers/lib/OpenLayers/Layer/EsriGeoJSON.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/OpenLayers_Control_TileStitchPrinter.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/jslibs/html2canvas.js"></script>
<!--application js-->

    
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_helicopter_swap_width_ds.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_wing_swap_width.js"></script>

<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_asw_sheet.js"></script>
<!--<script type="text/javascript" src="scripts/saris_sea_current_ws.js"></script>-->

<!--<script type="text/javascript" src="scripts/saris_datum_position_divergence.js"></script>-->

<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_download.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_simulation_datasources.js"></script> 
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_settings.js"></script>  
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_map_tab_toolbar_ui.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_map_layers_tree.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_map_tab_ui.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_viewport.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_basemaps.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/functions.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_map_layers_config.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_map_layers_loader.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_map.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_measure_distance.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_draw_features.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_add_wp.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_get_info.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_services_grid.js"></script>
<!--<script type="text/javascript" src="scripts/saris_point_datum.js"></script>-->
<!--<script type="text/javascript" src="scripts/saris_line_datum.js"></script>-->
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_monte_carlo.js"></script>

<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_calculation_value_holders.js"></script>
<!------saris simulation tabs-------->
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_datum_incident_ws.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_datum_definition_ws.js"></script>    
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_datum_method_ws.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_weather_ws.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_search_facilities_ws.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_total_effort_allocation_ws.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_worksheet_calculations.js"></script>
<script type="text/javascript" src="<?php echo $web_app_url?>/scripts/saris_search_plan.js"></script>
</head>
<body>
</body>
</html>
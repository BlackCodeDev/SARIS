<?php
header('Content-type: application/xml; charset=utf-8');
$url = $_GET["url"];
$t = file_get_contents(urldecode($url) . "?service=wms&version=1.3.0&request=GetCapabilities");
echo($t);
?>
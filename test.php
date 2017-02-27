<?php
$data = $_GET["data"];
$json = json_decode($data,true);
$response = array('success' => true,
    'data' => $json["lat"],
    'msg' => 'File Uploaded successfully'              
  );
  echo json_encode($response);
 
?>
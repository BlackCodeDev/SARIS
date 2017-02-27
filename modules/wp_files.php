<?php
if ($_FILES["file"]["error"] > 0)
{
  $error  = $_FILES["file"]["error"];
  $response = array('success' => false, 'msg' => $error);
  echo json_encode($response);
}
else
{
  $file_name = $_FILES["file"]["name"];
  $file_type = $_FILES["file"]["type"];
  $file_size = round($_FILES["file"]["size"] / 1024, 2) . "  Kilo Bytes";
  $file_contents = file_get_contents($_FILES['file']['tmp_name']);
  $rows = explode("\r\n", $file_contents);
  
  $linestring = "";    
    
  foreach($rows as $row){
      $coords =  explode(",", $row);
      $linestring =$linestring . $coords[0] . " " . $coords[1] .",";
  }    
    
  $response = array('success' => true,
    'data' => array('name' => $file_name, 'size' => $file_size),
    'msg' => 'File Uploaded successfully',
    'line' =>  substr($linestring, 0, -1),               
  );
  echo json_encode($response);
}
?>
<?php
  if (isset($_POST["kml_string"]) && !empty($_POST["kml_string"])) {
	  header("Content-type:application/vnd.google-earth.kml+xml");
	  header("Content-disposition: attachment; filename = ".$_POST["download_form_filename"].".kml");
	  echo($_POST["kml_string"]);
 
}else{  
    //echo "N0, mail is not set";
}
  
  // Creates a new csv file and store it in tmp directory
 
?>
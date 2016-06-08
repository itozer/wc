<?php
include("includes/database.php");

$bProcess = true;
$json = array();

// RECEIVE FORM VARIABLES --------------------------------------------------------------------------
if (isset($_GET['blowed'])) {
	$blowed = $_GET['blowed'];
} else {
	$bProcess = false;
}

if ($bProcess) {
	$isBlowed = $database->ReportBlowed();		
	$json['blowed'] = $isBlowed;
} else {
	$json['blowed'] = false;
}

$jsonEncoded = json_encode($json);

//FOR TESTING
/*
$json_output = json_decode($jsonEncoded);
foreach ( $json_output as $name => $value )
{
    echo "\n $name : $value";
}
*/

echo $jsonEncoded;

?>

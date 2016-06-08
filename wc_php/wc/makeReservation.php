<?php
include("includes/database.php");

$bProcess = true;
$json = array();

// RECEIVE FORM VARIABLES --------------------------------------------------------------------------
if (isset($_GET['reservedBy'])) {
	$reservedBy = $_GET['reservedBy'];
} else {
	$bProcess = false;
}

if ($bProcess) {
	$result = $database->ReserveBathroom($reservedBy);		
	$json['reserved'] = $result[0][1];
	$json['reservedBy'] = $result[0][2];
} else {
	$json['reserved'] = 0;
	$json['reservedBy'] = "";
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

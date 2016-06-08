<?php
include("includes/database.php");

$bProcess = true;

// RECEIVE FORM VARIABLES --------------------------------------------------------------------------
if (isset($_POST['occupied'])) {
	$bOccupied = $_POST['occupied'];
} else {
	$bProcess = false;
}

if (isset($_POST['isaac_is_awesome'])) {
	$bAwesome = $_POST['isaac_is_awesome'];
} else {
	$bProcess = false;
}
// -------------------------------------------------------------------------------------------------

$bUpdateStatus = false;

if ($bProcess) {
		$bUpdateStatus = $database->UpdateBathroomStatus($bOccupied);
		$bLogStatus = $database->LogStatus($bOccupied);
}

$json = array();

$json['validPost'] = $bProcess;
$json['updateDatabase'] = $bUpdateStatus;
$json['occupied'] = $bOccupied;
$json['log'] = $bLogStatus;
if (!$bProcess) {
	$json['security'] = "you little bitch";
}

$jsonEncoded = json_encode($json);

/*
//FOR TESTING
$json_output = json_decode($jsonEncoded);

foreach ( $json_output as $name => $value )
{
    echo "\n $name : $value";
}
*/

echo $jsonEncoded;

?>

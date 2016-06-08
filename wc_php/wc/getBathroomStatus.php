<?php
include("includes/database.php");

$result = $database->GetBathroomStatus();		

$json = array();
$json['occupied'] = $result[0][0];
$json['reserved'] = $result[0][1];
$json['reservedBy'] = $result[0][2];
$json['blowed'] = $result[0][4];

$jsonEncoded = json_encode($json);


//FOR TESTING
$json_output = json_decode($jsonEncoded);

/*
foreach ( $json_output as $name => $value )
{
    echo "\n $name : $value";
}
*/

echo $jsonEncoded;

?>

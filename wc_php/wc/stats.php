<!DOCTYPE HTML>
<html>
<head>
	<title>WC Stats</title>

	<link rel="stylesheet" type="text/css" href="css/main.css">
	<meta name="viewport" content="width=400, initial-scale=0.7">
</head>
<body id="bodyStats">

<div id="stats">
<?php
include("includes/database.php");
	
	//************** STATS *******************
	//duration
	$longestDumpEver = 0;
	$longestDumpAccomplishedOn = "";
	$averageTimeSpentInBathroom = 0;
	$averageHoursInBathroomPerWeek = 0;
	$totalBathroomMinutesToDate = 0;
	
	//quantity
	$mostVisitsInOneDay = 0;
	$averageVisitsPerWeek = 0;
	$busiestBathroomDay = "";		//what day of the week is the bathrooom used the most
	$leastBusyBathroomDay = "";
	//************** //STATS *******************
	
	$monMinutes = 0;
	$tuesMinutes = 0;
	$wedMinutes = 0;
	$thursMinutes = 0;
	$friMinutes = 0;
	
	$monWeekAverageMinutes = 0;
	$tuesWeekAverageMinutes = 0;
	$wedWeekAverageMinutes = 0;
	$thursWeekAverageMinutes = 0;
	$friWeekAverageMinutes = 0;
	
	$monVisits = 0;
	$tuesVisits = 0;
	$wedVisits = 0;
	$thursVisits = 0;
	$friVisits = 0;
	
	$monWeekMostVisits = 0;
	$tuesWeekMostVisits = 0;
	$wedWeekMostVisits = 0;
	$thursWeekMostVisits = 0;
	$friWeekMostVisits = 0;
	
	$monWeekAverageVisits = 0;
	$tuesWeekAverageVisits = 0;
	$wedWeekAverageVisits = 0;
	$thursWeekAverageVisits = 0;
	$friWeekAverageVisits = 0;
	
	$year = 0;
	$month = 0;
	$weekNumber = 0;
	$dayOfTheWeek = 0;
	
	$result = $database->GetBathroomStats();
	$numRecords = count($result);
	$date = new DateTime($result[1][2]);
	//$resultsSince = $date->format('g:ia \o\n l, F jS, Y');
	$resultsSince = $date->format('m.d.y');
	for ($i = 1; $i <= $numRecords; $i++) {
		$id = $result[$i][0];
		$status = $result[$i][1];	//0=available, 1=occupied
		$time = $result[$i][2];
		
		if (($status == 1) && ($i != $numRecords)) {
			$timeFrom = strtotime($time);
			//echo "time: " . $time;
			//echo "time from: " . $timeFrom;
			$timeTo = strtotime($result[++$i][2]);
			$duration = round(abs($timeTo - $timeFrom) / 60,2);
			$totalBathroomMinutesToDate = $totalBathroomMinutesToDate + $duration;
			
			if ($duration > $longestDumpEver) {
				$longestDumpEver = $duration;
				$date = new DateTime($result[$i][2]);
				$longestDumpAccomplishedOn = $date->format('g:ia \o\n l, F jS, Y');
			}
			

			if ($weekNumber == date("W", $timeFrom)) {
			//echo "week number: " . $weekNumber;
			//echo "day of the week: " . $dayOfTheWeek;
				if ($dayOfTheWeek == 1) {	
					$monMinutes = $monMinutes + $duration;
					$monVisits++;
					//echo "mon";
				} else if ($dayOfTheWeek == 2) {
					$tuesMinutes = $tuesMinutes + $duration;
					$tuesVisits++;
					//echo "tues";
				} else if ($dayOfTheWeek == 3) {
					$wedMinutes = $wedMinutes + $duration;
					$wedVisits++;
				} else if ($dayOfTheWeek == 4) {
					$thursMinutes = $thursMinutes + $duration;
					$thursVisits++;
				} else if ($dayOfTheWeek == 5) {
					$friMinutes = $friMinutes + $duration;
					$friVisits++;
				}
			} else {
				if ($monVisits > $monWeekMostVisits) {
					$monWeekMostVisits = $monVisits;
				}
				if ($tuesVisits > $tuesWeekMostVisits) {
					$tuesWeekMostVisits = $tuesVisits;
				}
				if ($wedVisits > $wedWeekMostVisits) {
					$wedWeekMostVisits = $wedVisits;
				}
				if ($thursVisits > $thursWeekMostVisits) {
					$thursWeekMostVisits = $thursVisits;
				}
				if ($friVisits > $friWeekMostVisits) {
					$friWeekMostVisits = $friVisits;
				}
				$monVisits = 0;
				$tuesVisits = 0;
				$wedVisits = 0;
				$thursVisits = 0;
				$friVisits = 0;
			}
			
			$year = date("Y", $timeFrom);
			$month = date('m', $timeFrom);
			$weekNumber = date("W", $timeFrom);
			$dayOfTheWeek = date( "w", $timeFrom);
		}
	}
	
	//echo $friWeekMostVisits;
	$arr = array('Monday' => intval($monWeekMostVisits), 'Tuesday' => $tuesWeekMostVisits, 'Wednesday' => $wedWeekMostVisits, 'Thursday' => $thursWeekMostVisits, 'Friday' => $friWeekMostVisits);
	//$arr = array('v1' => 543, 'v2' => 41, 'v3' => 1, 'v4' => 931);
	arsort($arr);
	$busiestWeekday = key($arr);
	$busiestWeekdayVisits = $arr[$busiestWeekday];
	end($arr);
	$leastBusyWeekday = key($arr);
	$leastBusyWeekdayVisits = $arr[$leastBusyWeekday];
	
	$averageTimeSpentInBathroom = round($totalBathroomMinutesToDate / ($numRecords/2), 2);
	//echo "**Stats since " . $resultsSince . "<br /><br /><br /><br />";
	echo "Man Stats <img src='images/mens_icon_small.png' width='20px' height='55px' alt='man' />.<br /><br /><br />";
	echo "The <span class='emphasize'>Longest Dump</span> in recorded history: <span class='emphasize'>" . $longestDumpEver . "</span> minutes.<br />Accomplished ". $longestDumpAccomplishedOn . ". <br /><br /><br /><br />";
	echo "<span class='emphasize'>Average time</span> spent in bathroom per visit: <span class='emphasize'>" . $averageTimeSpentInBathroom . "</span> minutes. <br /><br /><br /><br />";
	echo "Total <span class='emphasize'>collective time</span> spent in the bathroom since " . $resultsSince . ": <span class='emphasize'>" . round($totalBathroomMinutesToDate/60/24,2) . " days</span>. <br /><br /><br /><br />";
	echo "The <span class='emphasize'>busiest</span> bathroom day of the week is <span class='emphasize'>" . $busiestWeekday . "</span>, with a current record of " . $arr[$busiestWeekday] . " visits per day. <br /> The <span class='emphasize'>least busiest</span> bathroom day of the week is <span class='emphasize'>" . $leastBusyWeekday . "</span>, with a record of " . $leastBusyWeekdayVisits . " visits per day. <br /><br /><br /><br />"  
	
	
?>

</div>
</body>
</html>

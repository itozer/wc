<!DOCTYPE HTML>
<html>
<head>
	<title>WC</title>
	<script src="js/main.js"></script>	
	<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
	<script type="text/javascript" src="js/ajax.js"></script>
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<meta name="viewport" content="width=400, initial-scale=0.7">
</head>
<body id="status">

<div id="reservation">
	<div class="button" onclick="javascript:makeReservation()">On My Way</div>
	<!--
	<form name="reservation" action="#">
		<input type="text" name="reservedBy" id="reservedBy" placeholder="Declare Your Intentions For The Throne">
	</form>
	-->
</div>

<div id="blowedWrapper">
	<div class="button" onclick="javascript:reportBlowed()">Report Blowed</div>
</div>

<div id="wrapper">
	<div id="stinkLines" class="clean"><img src="images/stink_lines.png" width="500px" height="486px" alt="blowed" /></div>
	<div id="mens_icon">
		<img id="mens_img" src="images/mens_icon.png" width="169px" height="463px" alt="mens" />
		<h2 id="status_text">text</h2>
	</div>
</div>

</body>
</html>


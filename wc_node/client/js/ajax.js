var lock = false;
var blowedLock = false;

$(document).ready(function(){ 
	//alert("ready");
	GetBathroomStatus();
	timeoutID = setInterval(checkStatus, 3000);	//delay is in miliseconds (1000th of a second)
});

function getHTTPObject(){
	if (window.ActiveXObject) 
		return new ActiveXObject("Microsoft.XMLHTTP");
	else if (window.XMLHttpRequest) 
		return new XMLHttpRequest();
	else {
		alert("Your browser does not support AJAX.");
	return null;
	}
}

function displayStatus(){
	if(httpObject.readyState == 4){
		var jsonText = httpObject.responseText;
		var jsonObject = JSON.parse(jsonText);
		if (jsonObject.occupied == '1') {
			//alert("occupied");
			$("#status").removeClass("available reserved");
			$("#status").addClass("occupied");
			$("#status_text").text("Occupied");
			$("#reservation").removeClass("show");
			$("#reservation").addClass("hidden");
		} else if (jsonObject.reserved == '1') {
			//alert("reserved");
			$("#status").removeClass("occupied available");
			$("#status").addClass("reserved");
			$("#reservation").removeClass("show");
			$("#reservation").addClass("hidden");
			if (jsonObject.reservedBy === "") {
				//alert("reserved");
				$("#status_text").text("Reserved");
			} else {
				//alert("reservedBy");
				$("#status_text").text("Reserved: " + jsonObject.reservedBy);
			}
		} else {
			//alert("available");
			$("#status").removeClass("occupied reserved");
			$("#status").addClass("available");
			$("#status_text").text("Available");
			$("#reservation").addClass("show");
			$("#reservation").removeClass("hidden");
		}
	}
}

function GetBathroomStatus() {
	httpObject = getHTTPObject();
	if (httpObject != null) {
		httpObject.open("GET", "getBathroomStatus.php");
		httpObject.send(null);
		httpObject.onreadystatechange = displayStatus;
	}
}

function checkStatus() {
	//alert("timer called");
	GetBathroomStatus();
}

function reservationStatus() {
	if(httpObject.readyState == 4){
		var jsonText = httpObject.responseText;
		var jsonObject = JSON.parse(jsonText);
		//alert("reservationStatus: " + jsonObject.reserved);
		if (jsonObject.reserved == '1') {
			$("#status").removeClass("occupied available");
			$("#status").addClass("reserved");
			$("#reservation").removeClass("show");
			$("#reservation").addClass("hidden");
			if (jsonObject.reservedBy === "") {
				//alert("reserved");
				$("#status_text").text("Reserved");
			} else {
				//alert("reservedBy");
				$("#status_text").text("Reserved: " + jsonObject.reservedBy);
			}
			document.getElementById("reservedBy").value = "";
		}	
	}
	lock = false;
}

function blowedStatus() {
	if(httpObject.readyState == 4){
		var jsonText = httpObject.responseText;
		var jsonObject = JSON.parse(jsonText);
		//alert("reservationStatus: " + jsonObject.reserved);
		if (jsonObject.blowed == '1') {
			alert("blowed true");
			$("#stinkLines").removeClass("clean");
			$("#stinkLines").addClass("blowed");
		}	
	}
	blowedLock = false;
}

function makeReservation() {
	if (!lock) {
		httpObject = getHTTPObject();
		if (httpObject != null) {
			httpObject.open("GET", "makeReservation.php?reservedBy=" + document.getElementById("reservedBy").value);
			httpObject.send(null);
			httpObject.onreadystatechange = reservationStatus;
		}
		lock = true;
	}
}

function reportBlowed() {
	if (!blowedLock) {
		httpObject = getHTTPObject();
		if (httpObject != null) {
			httpObject.open("GET", "reportBlowed.php?blowed=kaboom");
			httpObject.send(null);
			httpObject.onreadystatechange = blowedStatus;
		}
		blowedLock = true;
	}
}



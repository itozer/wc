<?php

// DATABASE LOGIN CREDENTIALS
define("DB_SERVER", "173.201.88.49");
define("DB_USER", "cresbathroom");
define("DB_PASS", "getAwesome14!");
define("DB_NAME", "cresbathroom");

/**
 * Special Names and Level Constants - the admin
 * page will only be accessible to the user with
 * the admin name and also to those users at the
 * admin user level.
 */
define("ADMIN_NAME", "Admin");
define("ADMIN_LEVEL", 1);
define("USER_LEVEL",  0);

// TRACK VISITORS?
define("TRACK_USERS", true);

// TIMEOUT TIMES IN MINUTES
define("USER_TIMEOUT", 60 * 10);
define("ADMIN_TIMEOUT", 60 * 10);

// RESERVATION TIMEOUT IN SECONDS
define("RESERVATION_TIMEOUT", 30);
//define("BLOWED_TIMEOUT", 300);	//5 min
define("BLOWED_TIMEOUT", 10);	//5 min

//COOKIE CONSTANTS
define("COOKIE_EXPIRE", 60*60*3);  //3 hours
define("COOKIE_PATH", "/");  //Available in whole domain

/**
 * EMAIL CONSTANTS
 * whether or not to send welcome email on registration
 */
define("EMAIL_FROM_NAME", "Pet Dental");
define("EMAIL_FROM_ADDRESS", "itozer@gmail.com");
define("EMAIL_WELCOME", true);

// SECURITY CONSTANTS
define ("SALT", "izaktoz");

?>
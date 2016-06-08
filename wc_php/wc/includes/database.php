<?php

include("constants.php");

class MySQLDB {

	private $connection;
	
	//CLASS CONSTRUCTOR
	public function __construct() {
     	try {
			$this->connection = new PDO('mysql:dbname=' . DB_NAME . ';host=' . DB_SERVER . ';charset=utf8', DB_USER, DB_PASS);
			$this->connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			$this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
		}
	}

	
	public function UpdateBathroomStatus($bOccupied) {
		try {
		  if ($bOccupied) {
			  $stmt = $this->connection->prepare('UPDATE bathroom SET occupied = :occupied, reserved = 0, reservedBy = "" WHERE id=1');
		  } else {
			  $stmt = $this->connection->prepare('UPDATE bathroom SET occupied = :occupied WHERE id=1');
		  }
		 
		  $stmt->execute(array(
		  	'occupied' => $bOccupied,
		  ));
		  
		  if ($stmt->rowCount() == 1) {
			return true;
		  } else {
			return false;
		  }
		  
		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			return false;
		}	
	}
	
	public function ReserveBathroom($reservedBy) {
		try {
		  $stmt = $this->connection->prepare('UPDATE bathroom SET reserved = 1, reservedBy = :reservedBy, reservedDate = NOW() WHERE id=1 AND occupied=0 AND reserved=0');
		  $stmt->execute(array(
		  	':reservedBy' => $reservedBy
		  ));
		 		 
		  //echo "row count: " . $stmt->rowCount() . " ";
		  if ($stmt->rowCount() == 1) {
		  	$this->LogReserved($reservedBy);
			return $this->GetBathroomStatus();
		  } else {
		  	//echo "reserve bathroom false - ";
			return false;
		  }
		  
		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			return false;
		}	
	}
	
	public function ReportBlowed() {
		try {
		  $stmt = $this->connection->prepare('UPDATE bathroom SET blowed = 1, blowedDate = NOW() WHERE id=1 AND blowed=0');
		  $stmt->execute(array(
		  	//nothing
		  ));
		 		 
		  //echo "row count: " . $stmt->rowCount() . " ";
		  if ($stmt->rowCount() == 1) {		  	
			return true;
		  } else {
		  	//echo "reserve bathroom false - ";
			return false;
		  }
		  
		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			return false;
		}	
	}	
	
	private function ReserveTimeout() {
		try {
		  $stmt = $this->connection->prepare('UPDATE bathroom SET reserved = 0, reservedBy = "" WHERE id = :id');
		  $stmt->execute(array(
		  	':id' => 1
		  ));
		  
		  /*
		  if ($stmt->rowCount() == 1) {
		  	//echo "reserve bathroom true - ";
			return true;
		  } else {
		  	//echo "reserve bathroom false - ";
			return false;
		  }
		  */
		  
		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			//return false;
		}	
	}
	
	private function BlowedTimeout() {
		try {
		  $stmt = $this->connection->prepare('UPDATE bathroom SET blowed = 0 WHERE id = :id');
		  $stmt->execute(array(
		  	':id' => 1
		  ));
		  		  
		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			//return false;
		}	
	}	
	
	public function GetBathroomStatus() {
		try {
		  $stmt = $this->connection->prepare('SELECT occupied, reserved, reservedBy, reservedDate, blowed, blowedDate, NOW() FROM bathroom WHERE id = :id');
		  $stmt->execute(array(
		  	':id'=> 1
		  ));
		 
		  $result = $stmt->fetchAll();
		  
		  if ( count($result) == 1) {
		  	//echo $result[0][1];
		  	if ($result[0][1] == '1') {
		  		date_default_timezone_set('America/Los_Angeles');
				$reservedDate = strtotime($result[0][3]);
				$currentDate = strtotime($result[0][6]);
				//echo $reservedDate . " : " . $currentDate;
				if ($currentDate - $reservedDate > RESERVATION_TIMEOUT) {
					$this->ReserveTimeout();
				}
			}
		  	if ($result[0][4] == '1') {
		  		date_default_timezone_set('America/Los_Angeles');
				$reservedDate = strtotime($result[0][5]);
				$currentDate = strtotime($result[0][6]);
				if ($currentDate - $reservedDate > BLOWED_TIMEOUT) {
					$this->BlowedTimeout();
				}
			}			
			return $result;
		  } else {
			return false;
		  }
		  
		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			return -1;
		}
	}
	
	public function LogStatus($bOccupied) {
		try {
		  //$stmt = $this->connection->prepare('UPDATE bathroom SET occupied = :occupied, LastModified = NOW())');
		  $stmt = $this->connection->prepare('INSERT INTO stats (occupied, time) VALUES (:occupied, NOW())');
		  $stmt->execute(array(
		  	':occupied' => $bOccupied
		  ));
		 		 
		  return ($stmt->rowCount() == 1) ? true : false;
		
		} catch(PDOException $e) {
		  //echo 'Error: ' . $e->getMessage();
		  return false;
		}  
	}
	
	private function LogReserved($reservedMessage) {
		try {
		  $stmt = $this->connection->prepare('INSERT INTO reservedLog (reservedDate, reservedMessage) VALUES (NOW(), :reservedMessage)');
		  $stmt->execute(array(
		  	':reservedMessage' => $reservedMessage
		  ));
		 		 
		  return ($stmt->rowCount() == 1) ? true : false;
		
		} catch(PDOException $e) {
		  //echo 'Error: ' . $e->getMessage();
		  return false;
		}	  
	}
	
	public function GetBathroomStats() {
		try {
		  $stmt = $this->connection->prepare('SELECT * FROM stats ORDER BY time ASC');
		  $stmt->execute(array(
		  	//can i have nothing here??
		  ));
		 
		  $result = $stmt->fetchAll();
		  
		  return $result;

		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			return -1;
		}
	}
		
 }
 
$database = new MySQLDB;

?>

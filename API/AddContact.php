<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Credentials: true");
 header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
 header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
 
	$inData = getRequestInfo();

	$UserID = $inData["UserID"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$PhoneNumber = $inData["PhoneNumber"];
	$Email = $inData["Email"];

	$conn = new mysqli("localhost", "cop4331u_contactsuser", "cop4331group16", "cop4331u_contacts");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}

	else
	{
		/*if (strlen($FirstName) < 1 || strlen($LastName) < 1 || strlen($PhoneNumber) < 1 || strlen($Email))
		{
			//$retValue = '{"error": Not enough arguments passed}';
			//sendResultInfoAsJson( $retValue );
			die("Error: Not enough arguments");
		}*/

		$sql = "insert into Contact (UserId,FirstName,LastName,PhoneNumber,Email) VALUES (" . $UserID . ",'" . $FirstName . "','" . $LastName . "','" . $PhoneNumber . "','" . $Email . "')";

		if( $result = $conn->query($sql) === TRUE )
		{
		    echo "Contact has been added.";
		}
		else
		{
			die ("Cannot add contact.");
		}
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>

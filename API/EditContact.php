<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Credentials: true");
 header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
 header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

	$inData = getRequestInfo();

	$ContactID = $inData["ContactID"];
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
		$sql = "update Contact set FirstName= '" . $FirstName . "', LastName= '" . $LastName . "', PhoneNumber= '" . $PhoneNumber . "', Email= '" . $Email . "' where ID= " . $ContactID;

		//if( $result = $conn->query($sql) != TRUE )
		//{
			//returnWithError( $conn->error );
		//}

    //echo "Contacts edited successfully"
		//$conn->close();

    if( $result = $conn->query($sql) === TRUE )
		{
		    echo "Contact Saved.";
		}
		else
		{
			die ("Could not edit contact.");
		}
		$conn->close();
	}

  //$retMessage = '{"Contacts edited successfully"}';
  //returnWithError( $retMessage );
	//returnWithError("");

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

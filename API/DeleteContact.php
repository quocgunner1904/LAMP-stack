<?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Credentials: true");
 header("Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT");
 header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

	$inData = getRequestInfo();

	$ContactID = $inData["ContactID"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	//$Email = $inData["Email"];

	$conn = new mysqli("localhost", "cop4331u_contactsuser", "cop4331group16", "cop4331u_contacts");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}

	else
	{
		$sql = "DELETE FROM Contact where ID=" . $ContactID;
		//$sql = "DELETE FROM Contact where FirstName='" . $FirstName . "' and LastName='" . $LastName . "' and Email='" . $Email . "'";

		//if( $result = $conn->query($sql) != TRUE )
		//{
			//returnWithError( $conn->error );
		//}
		//$conn->close();
    if( $result = $conn->query($sql) === TRUE )
    {
        echo "Contact deleted.";
    }
    else
    {
      die ("Contact couldn't be deleted.");
    }
    $conn->close();
	}

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

<?php

    $inData = getRequestInfo();


    $conn = new mysqli("localhost", "API", "Ethan", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}

    else
	{

        //TODO 
        //Check if they are registered already
        
		$stmt = $conn->prepare("INSERT INTO Users (firstName,lastName,Login,Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($stmt->affected_rows > 0) {
            returnWithInfo($inData["firstname"], $inData["lastname"], $conn->insert_id);
        }
        else {

            returnWithError("Unable to Create the Record");
        }

		$stmt->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}



?>
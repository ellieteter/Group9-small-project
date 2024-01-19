<?php

$inData = getRequestInfo();

$conn = new mysqli("localhost", "API", "Ethan", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {

    //Check if they are registered already
    $checkstmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");

    $checkstmt->bind_param("s", $inData["login"]);
    $checkstmt->execute();

    $checkresult = $checkstmt->get_result();

    if ($checkresult->num_rows > 0) {
        //User is already registered
        returnWithError("User already registered with this login");
    } else {
        $stmt = $conn->prepare("INSERT INTO Users (firstName,lastName,Login,Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $inData["firstname"], $inData["lastName"], $inData["login"], $inData["password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($stmt->affected_rows > 0) {
            returnWithInfo($inData["firstname"], $inData["lastname"], $conn->insert_id);
        } else {

            returnWithError("Unable to Create the Record");
        }

        $stmt->close();
        $conn->close();
    }

    $checkstmt->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}



?>
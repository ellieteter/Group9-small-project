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
        $checkstmt->close();
        $conn->close();
        http_response_code(409);
        returnWithError("User already registered with this login");
    } else {
        $stmt = $conn->prepare("INSERT into Users (firstName,lastName,Login,Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($conn->affected_rows > 0) {
            http_response_code(200);
            returnWithInfo($inData["firstName"], $inData["lastName"], $conn->insert_id);
        } else {
            http_response_code(409);
            returnWithError("Unable to Create the Record");
        }

        $stmt->close();
    }

    $conn->close();
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

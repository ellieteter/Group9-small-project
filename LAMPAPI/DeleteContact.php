<?php

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];
$userID = $inData["userID"];

$conn = new mysqli("localhost", "API", "Ethan", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE (firstName = ? AND lastName = ? AND phone = ? AND email = ? AND userID = ?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        http_response_code(200);
    } else {
        http_response_code(500);
        returnWithError("Couldn't Delete from Contact");
    }

    $stmt->close();
    $conn->close();
    returnWithError("");
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

<?php

$inData = getRequestInfo();

$userId = $inData["userId"];


$conn = new mysqli("localhost", "API", "Ethan", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE (userID = ?)");
    $stmt->bind_param("s", $userId);
    $stmt->execute();

    //delete the user itself
    $stmt = $conn->prepare("DELETE FROM Users WHERE (ID = ?)");
    $stmt->bind_param("s", $userId);
    $stmt->execute();

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

?>
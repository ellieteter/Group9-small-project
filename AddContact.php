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
    $stmt = $conn->prepare("INSERT into Contacts (firstName,lastName,phone,email,userID) VALUES(?,?,?,?,?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $phone, $email, $userID);
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
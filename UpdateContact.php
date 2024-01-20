<?php

$inData = getRequestInfo();


$conn = new mysqli("localhost", "API", "Ethan", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {

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
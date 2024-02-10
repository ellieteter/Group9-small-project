<?php

$inData = getRequestInfo();


$conn = new mysqli("localhost", "API", "Ethan", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET firstName = ?, lastName = ?,phone = ?,email = ? WHERE UserID = ? AND firstName = ? AND lastName = ? AND phone = ? AND email = ? ");
    $stmt->bind_param("sssssssss", $inData["NEWfirstName"], $inData["NEWlastName"], $inData["NEWphone"], $inData["NEWemail"], $inData["userId"], $inData["OLDfirstName"], $inData["OLDlastName"], $inData["OLDphone"], $inData["OLDemail"]);
    $stmt->execute();

    if ($conn->affected_rows > 0) {
        http_response_code(200);
    } else {
        http_response_code(409);
        returnWithError("Couldn't Update Contact");
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
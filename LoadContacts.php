<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "API", "Ethan", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=?");
    $contactName = "%" . $inData["search"] . "%";
    $stmt->bind_param("s", $inData["userId"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"FirstName":"' . $row["FirstName"] . '", "LastName":"' . $row["LastName"] . '", "Phone":"' . $row["Phone"] . '", "Email":"' . $row["Email"] . '"}';
    }

    if ($searchCount == 0) {
        http_response_code(409);
        returnWithError("No Records Found");
    } else {
        http_response_code(200);
        returnWithInfo($searchResults, $searchCount);
    }

    $stmt->close();
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
    $retValue = '{"id":0, "error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults, $searchCount)
{
    $retValue = '{"results":[' . $searchResults . '],"Count":"' . $searchCount . '","error":""}';
    sendResultInfoAsJson($retValue);
}


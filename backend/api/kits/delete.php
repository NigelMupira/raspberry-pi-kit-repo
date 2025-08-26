<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

if (!isset($_GET['id'])) {
    sendJsonResponse(["error" => "Kit ID is required"], 400);
}

try {
    $kitId = $_GET['id'];
    $pdo = getDBConnection();

    // Check if kit exists and is not currently loaned
    $checkStmt = $pdo->prepare("
        SELECT status FROM kits WHERE id = ?
    ");
    $checkStmt->execute([$kitId]);
    $kit = $checkStmt->fetch();

    if (!$kit) {
        sendJsonResponse(["error" => "Kit not found"], 404);
    }

    if ($kit['status'] === 'Loaned') {
        sendJsonResponse(["error" => "Cannot delete a kit that is currently loaned"], 400);
    }

    // Delete the kit (kit_components will be deleted automatically due to CASCADE)
    $stmt = $pdo->prepare("DELETE FROM kits WHERE id = ?");
    $stmt->execute([$kitId]);

    if ($stmt->rowCount() > 0) {
        sendJsonResponse(["message" => "Kit deleted successfully"]);
    } else {
        sendJsonResponse(["error" => "Kit not found"], 404);
    }

} catch (PDOException $e) {
    sendJsonResponse(["error" => "Failed to delete kit: " . $e->getMessage()], 500);
}
?>
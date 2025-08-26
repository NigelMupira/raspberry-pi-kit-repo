<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

if (!isset($_GET['id'])) {
    sendJsonResponse(["error" => "Loan ID is required"], 400);
}

try {
    $loanId = $_GET['id'];
    $data = getJsonInput();

    // Validation
    if (!isset($data['conditionReturned'])) {
        sendJsonResponse(["error" => "Return condition is required"], 400);
    }

    $pdo = getDBConnection();

    // Start transaction
    $pdo->beginTransaction();

    // Check if loan exists and is not already returned
    $loanStmt = $pdo->prepare("
        SELECT l.*, k.id as kit_id 
        FROM loans l 
        JOIN kits k ON l.kit_id = k.id 
        WHERE l.id = ? AND l.returned_at IS NULL
    ");
    $loanStmt->execute([$loanId]);
    $loan = $loanStmt->fetch();

    if (!$loan) {
        sendJsonResponse(["error" => "Loan not found or already returned"], 404);
    }

    // Update loan return information
    $returnStmt = $pdo->prepare("
        UPDATE loans 
        SET returned_at = NOW(), condition_returned = ?
        WHERE id = ?
    ");

    $returnStmt->execute([
        $data['conditionReturned'],
        $loanId
    ]);

    // Update returned components if provided
    if (!empty($data['componentsReturned']) && is_array($data['componentsReturned'])) {
        $componentStmt = $pdo->prepare("
            UPDATE loan_components 
            SET returned = TRUE 
            WHERE loan_id = ? AND component_id = ?
        ");

        foreach ($data['componentsReturned'] as $componentId) {
            $componentStmt->execute([$loanId, $componentId]);
        }
    }

    // Update kit status and condition
    $kitStmt = $pdo->prepare("
        UPDATE kits 
        SET status = 'Available', condition = ?
        WHERE id = ?
    ");

    $kitStmt->execute([
        $data['conditionReturned'],
        $loan['kit_id']
    ]);

    $pdo->commit();

    sendJsonResponse(["message" => "Loan returned successfully"]);

} catch (PDOException $e) {
    $pdo->rollBack();
    sendJsonResponse(["error" => "Failed to return loan: " . $e->getMessage()], 500);
}
?>
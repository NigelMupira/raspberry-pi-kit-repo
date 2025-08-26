<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

try {
    $data = getJsonInput();

    // Validation
    if (!isset($data['kitId']) || empty($data['kitId'])) {
        sendJsonResponse(["error" => "Kit ID is required"], 400);
    }

    if (!isset($data['studentId']) || empty($data['studentId'])) {
        sendJsonResponse(["error" => "Student ID is required"], 400);
    }

    if (!isset($data['due']) || empty($data['due'])) {
        sendJsonResponse(["error" => "Due date is required"], 400);
    }

    $pdo = getDBConnection();

    // Start transaction
    $pdo->beginTransaction();

    // Check if kit is available
    $kitStmt = $pdo->prepare("SELECT status FROM kits WHERE id = ?");
    $kitStmt->execute([$data['kitId']]);
    $kit = $kitStmt->fetch();

    if (!$kit) {
        sendJsonResponse(["error" => "Kit not found"], 404);
    }

    if ($kit['status'] !== 'Available') {
        sendJsonResponse(["error" => "Kit is not available for loan"], 400);
    }

    // Check if student exists
    $studentStmt = $pdo->prepare("SELECT id FROM students WHERE id = ?");
    $studentStmt->execute([$data['studentId']]);

    if (!$studentStmt->fetch()) {
        sendJsonResponse(["error" => "Student not found"], 404);
    }

    // Create loan
    $loanStmt = $pdo->prepare("
        INSERT INTO loans (kit_id, student_id, due_at, condition_borrowed) 
        VALUES (?, ?, ?, ?)
    ");

    $loanStmt->execute([
        $data['kitId'],
        $data['studentId'],
        $data['due'],
        $data['conditionBorrowed'] ?? 'Good'
    ]);

    $loanId = $pdo->lastInsertId();

    // Get kit components and add to loan_components
    $componentsStmt = $pdo->prepare("
        SELECT component_id 
        FROM kit_components 
        WHERE kit_id = ?
    ");
    $componentsStmt->execute([$data['kitId']]);
    $components = $componentsStmt->fetchAll();

    $loanComponentStmt = $pdo->prepare("
        INSERT INTO loan_components (loan_id, component_id, returned) 
        VALUES (?, ?, FALSE)
    ");

    foreach ($components as $component) {
        $loanComponentStmt->execute([
            $loanId,
            $component['component_id']
        ]);
    }

    // Update kit status to Loaned
    $updateKitStmt = $pdo->prepare("UPDATE kits SET status = 'Loaned' WHERE id = ?");
    $updateKitStmt->execute([$data['kitId']]);

    $pdo->commit();

    sendJsonResponse([
        "message" => "Loan created successfully",
        "loan_id" => $loanId
    ], 201);

} catch (PDOException $e) {
    $pdo->rollBack();
    sendJsonResponse(["error" => "Failed to create loan: " . $e->getMessage()], 500);
}
?>
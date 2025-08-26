<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

if (!isset($_GET['id'])) {
    sendJsonResponse(["error" => "Student ID is required"], 400);
}

try {
    $studentId = $_GET['id'];
    $data = getJsonInput();

    // Validation
    if (!isset($data['name']) || empty($data['name'])) {
        sendJsonResponse(["error" => "Student name is required"], 400);
    }

    if (!isset($data['studentId']) || empty($data['studentId'])) {
        sendJsonResponse(["error" => "Student ID is required"], 400);
    }

    if (!isset($data['email']) || empty($data['email'])) {
        sendJsonResponse(["error" => "Email is required"], 400);
    }

    $pdo = getDBConnection();

    // Check if student exists
    $checkStmt = $pdo->prepare("SELECT id FROM students WHERE id = ?");
    $checkStmt->execute([$studentId]);

    if (!$checkStmt->fetch()) {
        sendJsonResponse(["error" => "Student not found"], 404);
    }

    // Check if new student ID already exists (excluding current student)
    $checkIdStmt = $pdo->prepare("SELECT id FROM students WHERE student_id = ? AND id != ?");
    $checkIdStmt->execute([$data['studentId'], $studentId]);

    if ($checkIdStmt->fetch()) {
        sendJsonResponse(["error" => "Student ID already exists"], 400);
    }

    // Update student
    $stmt = $pdo->prepare("
        UPDATE students 
        SET student_id = ?, name = ?, email = ?, phone = ?, program = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $data['studentId'],
        $data['name'],
        $data['email'],
        $data['phone'] ?? '',
        $data['program'] ?? '',
        $studentId
    ]);

    sendJsonResponse(["message" => "Student updated successfully"]);

} catch (PDOException $e) {
    sendJsonResponse(["error" => "Failed to update student: " . $e->getMessage()], 500);
}
?>
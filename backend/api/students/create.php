<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

try {
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

    // Check if student ID already exists
    $checkStmt = $pdo->prepare("SELECT id FROM students WHERE student_id = ?");
    $checkStmt->execute([$data['studentId']]);

    if ($checkStmt->fetch()) {
        sendJsonResponse(["error" => "Student ID already exists"], 400);
    }

    // Insert student
    $stmt = $pdo->prepare("
        INSERT INTO students (student_id, name, email, phone, program) 
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['studentId'],
        $data['name'],
        $data['email'],
        $data['phone'] ?? '',
        $data['program'] ?? ''
    ]);

    $studentId = $pdo->lastInsertId();

    sendJsonResponse([
        "message" => "Student created successfully",
        "student_id" => $studentId
    ], 201);

} catch (PDOException $e) {
    sendJsonResponse(["error" => "Failed to create student: " . $e->getMessage()], 500);
}
?>
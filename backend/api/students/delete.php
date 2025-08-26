<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

if (!isset($_GET['id'])) {
    sendJsonResponse(["error" => "Student ID is required"], 400);
}

try {
    $studentId = $_GET['id'];
    $pdo = getDBConnection();

    // Check if student exists and has no active loans
    $checkStmt = $pdo->prepare("
        SELECT s.id 
        FROM students s
        LEFT JOIN loans l ON s.id = l.student_id AND l.returned_at IS NULL
        WHERE s.id = ? AND l.id IS NOT NULL
    ");
    $checkStmt->execute([$studentId]);

    if ($checkStmt->fetch()) {
        sendJsonResponse(["error" => "Cannot delete a student with active loans"], 400);
    }

    // Delete the student
    $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
    $stmt->execute([$studentId]);

    if ($stmt->rowCount() > 0) {
        sendJsonResponse(["message" => "Student deleted successfully"]);
    } else {
        sendJsonResponse(["error" => "Student not found"], 404);
    }

} catch (PDOException $e) {
    sendJsonResponse(["error" => "Failed to delete student: " . $e->getMessage()], 500);
}
?>
<?php
require_once '../config.php';

try {
    $pdo = getDBConnection();

    $stmt = $pdo->query("
        SELECT * FROM students ORDER BY name
    ");

    $students = $stmt->fetchAll();

    // Convert ID to integer
    foreach ($students as &$student) {
        $student['id'] = (int)$student['id'];
    }

    sendJsonResponse($students);

} catch (PDOException $e) {
    sendJsonResponse(["error" => "Failed to fetch students: " . $e->getMessage()], 500);
}
?>
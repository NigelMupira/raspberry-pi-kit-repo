<?php
require_once '../config.php';

try {
    $pdo = getDBConnection();

    // Get all loans with kit, student, and component information
    $stmt = $pdo->query("
        SELECT 
            l.*,
            k.name as kit_name,
            k.image_url as kit_image,
            s.name as student_name,
            s.student_id,
            s.email as student_email,
            GROUP_CONCAT(CONCAT(c.id, ':', c.name, ':', lc.returned) SEPARATOR ';') as component_status
        FROM loans l
        JOIN kits k ON l.kit_id = k.id
        JOIN students s ON l.student_id = s.id
        LEFT JOIN loan_components lc ON l.id = lc.loan_id
        LEFT JOIN components c ON lc.component_id = c.id
        GROUP BY l.id
        ORDER BY l.borrowed_at DESC
    ");

    $loans = [];
    while ($row = $stmt->fetch()) {
        $components = [];
        if (!empty($row['component_status'])) {
            $componentItems = explode(';', $row['component_status']);
            foreach ($componentItems as $item) {
                if (!empty($item)) {
                    list($id, $name, $returned) = explode(':', $item);
                    $components[] = [
                        'id' => (int)$id,
                        'name' => $name,
                        'returned' => (bool)$returned
                    ];
                }
            }
        }

        $loans[] = [
            'id' => (int)$row['id'],
            'kitId' => (int)$row['kit_id'],
            'studentId' => (int)$row['student_id'],
            'borrowed' => $row['borrowed_at'],
            'returned' => $row['returned_at'],
            'due' => $row['due_at'],
            'conditionBorrowed' => $row['condition_borrowed'],
            'conditionReturned' => $row['condition_returned'],
            'kitName' => $row['kit_name'],
            'kitImage' => $row['kit_image'],
            'studentName' => $row['student_name'],
            'studentId' => $row['student_id'],
            'studentEmail' => $row['student_email'],
            'componentsIncluded' => $components,
            'componentsReturned' => array_filter($components, function($comp) {
                return $comp['returned'];
            })
        ];
    }

    sendJsonResponse($loans);

} catch (PDOException $e) {
    sendJsonResponse(["error" => "Failed to fetch loans: " . $e->getMessage()], 500);
}
?>
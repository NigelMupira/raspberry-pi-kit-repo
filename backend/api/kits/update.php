<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

if (!isset($_GET['id'])) {
    sendJsonResponse(["error" => "Kit ID is required"], 400);
}

try {
    $kitId = $_GET['id'];
    $data = getJsonInput();

    $pdo = getDBConnection();

    // Start transaction
    $pdo->beginTransaction();

    // Update kit
    $stmt = $pdo->prepare("
        UPDATE kits 
        SET name = ?, description = ?, `condition` = ?, status = ?, image_url = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $data['name'],
        $data['description'] ?? '',
        $data['condition'] ?? 'Good',
        $data['status'] ?? 'Available',
        $data['image'] ?? '',
        $kitId
    ]);

    // Delete existing components
    $deleteStmt = $pdo->prepare("DELETE FROM kit_components WHERE kit_id = ?");
    $deleteStmt->execute([$kitId]);

    // Insert new components if provided
    if (!empty($data['components']) && is_array($data['components'])) {
        $componentStmt = $pdo->prepare("
            INSERT INTO kit_components (kit_id, component_id, quantity) 
            VALUES (?, ?, ?)
        ");

        foreach ($data['components'] as $component) {
            if (!empty($component['name'])) {
                // First, get or create component
                $compStmt = $pdo->prepare("
                    INSERT INTO components (name) VALUES (?) 
                    ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
                ");
                $compStmt->execute([$component['name']]);
                $componentId = $pdo->lastInsertId();

                // Link component to kit
                $componentStmt->execute([
                    $kitId,
                    $componentId,
                    $component['quantity'] ?? 1
                ]);
            }
        }
    }

    $pdo->commit();

    sendJsonResponse(["message" => "Kit updated successfully"]);

} catch (PDOException $e) {
    $pdo->rollBack();
    sendJsonResponse(["error" => "Failed to update kit: " . $e->getMessage()], 500);
}
?>
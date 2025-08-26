<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(["error" => "Method not allowed"], 405);
}

try {
    $data = getJsonInput();

    if (!isset($data['name']) || empty($data['name'])) {
        sendJsonResponse(["error" => "Kit name is required"], 400);
    }

    $pdo = getDBConnection();

    // Start transaction
    $pdo->beginTransaction();

    // Insert kit
    $stmt = $pdo->prepare("
        INSERT INTO kits (name, description, 'condition', status, image_url) 
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['name'],
        $data['description'] ?? '',
        $data['condition'] ?? 'Good',
        $data['status'] ?? 'Available',
        $data['image'] ?? ''
    ]);

    $kitId = $pdo->lastInsertId();

    // Insert components if provided
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

    sendJsonResponse([
        "message" => "Kit created successfully",
        "kit_id" => $kitId
    ], 201);

} catch (PDOException $e) {
    $pdo->rollBack();
    sendJsonResponse(["error" => "Failed to create kit: " . $e->getMessage()], 500);
}
?>
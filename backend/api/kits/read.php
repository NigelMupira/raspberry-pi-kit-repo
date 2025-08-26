<?php
require_once '../config.php';

try {
    $pdo = getDBConnection();

    // Get all kits with their components
    $stmt = $pdo->query("
        SELECT k.id, k.name, k.description, k.`condition`, k.status, k.image_url, k.created_at, k.updated_at,
               GROUP_CONCAT(CONCAT(c.id, ':', c.name, ':', kc.quantity) SEPARATOR ';') as component_list
        FROM kits k
        LEFT JOIN kit_components kc ON k.id = kc.kit_id
        LEFT JOIN components c ON kc.component_id = c.id
        GROUP BY k.id
        ORDER BY k.name
    ");

    $kits = [];
    while ($row = $stmt->fetch()) {
        $components = [];
        if (!empty($row['component_list'])) {
            $componentItems = explode(';', $row['component_list']);
            foreach ($componentItems as $item) {
                if (!empty($item)) {
                    list($id, $name, $quantity) = explode(':', $item);
                    $components[] = [
                        'id' => (int)$id,
                        'name' => $name,
                        'quantity' => (int)$quantity
                    ];
                }
            }
        }

        $kits[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'condition' => $row['condition'],
            'status' => $row['status'],
            'image' => $row['image_url'],
            'components' => $components,
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }

    sendJsonResponse($kits);

} catch (PDOException $e) {
    sendJsonResponse(["error" => "Failed to fetch kits: " . $e->getMessage()], 500);
}
?>
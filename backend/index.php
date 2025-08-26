<?php
// Simple router for the API
$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$request = strtok($request, '?');

// API routes
$routes = [
    '/api/kits' => 'api/kits/read.php',
    '/api/kits/create' => 'api/kits/create.php',
    '/api/kits/update' => 'api/kits/update.php',
    '/api/kits/delete' => 'api/kits/delete.php',

    '/api/students' => 'api/students/read.php',
    '/api/students/create' => 'api/students/create.php',
    '/api/students/update' => 'api/students/update.php',
    '/api/students/delete' => 'api/students/delete.php',

    '/api/loans' => 'api/loans/read.php',
    '/api/loans/create' => 'api/loans/create.php',
    '/api/loans/return' => 'api/loans/return.php',
];

// Find matching route
$matched = false;
foreach ($routes as $route => $file) {
    if (strpos($request, $route) === 0) {
        // Check if the file exists
        if (file_exists($file)) {
            require_once $file;
            $matched = true;
            break;
        }
    }
}

// If no route matched, return 404
if (!$matched) {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["error" => "Endpoint not found"]);
}
?>
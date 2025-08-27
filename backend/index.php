<?php
// Simple router for the API
$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$request = strtok($request, '?');

// Handle the root path
if ($request === '/' || $request === '') {
    echo json_encode(["message" => "Raspberry Pi Kit Repository API", "status" => "OK"]);
    exit();
}

// API routes - now with more specific matching
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

// Find matching route with better matching logic
$matched = false;
foreach ($routes as $route => $file) {
    // Check if the request starts with the route path
    if (strpos($request, $route) === 0) {
        // For exact matches or routes with parameters
        if ($request === $route ||
            (strlen($request) > strlen($route) && $request[strlen($route)] === '/') ||
            (strpos($route, '/api/loans/return') === 0 && strpos($request, '/api/loans/return') === 0)) {

            // Check if the file exists
            if (file_exists($file)) {
                require_once $file;
                $matched = true;
                break;
            }
        }
    }
}

// If no route matched, return 404
if (!$matched) {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["error" => "Endpoint not found", "requested_path" => $request]);
}
?>
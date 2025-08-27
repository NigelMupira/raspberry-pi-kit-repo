<?php
// Enable full error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Get request details
$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$request = strtok($request, '?');

// Debug output
error_log("API Request: " . $request . " Method: " . $method);

// Handle the root path
if ($request === '/' || $request === '' || $request === '/index.php') {
    echo json_encode([
        "message" => "Raspberry Pi Kit Repository API",
        "status" => "OK",
        "timestamp" => date('Y-m-d H:i:s')
    ]);
    exit();
}

// Define API routes
$routes = [
    '/api/kits' => ['GET' => 'api/kits/read.php'],
    '/api/kits/create' => ['POST' => 'api/kits/create.php'],
    '/api/kits/update' => ['PUT' => 'api/kits/update.php'],
    '/api/kits/delete' => ['DELETE' => 'api/kits/delete.php'],

    '/api/students' => ['GET' => 'api/students/read.php'],
    '/api/students/create' => ['POST' => 'api/students/create.php'],
    '/api/students/update' => ['PUT' => 'api/students/update.php'],
    '/api/students/delete' => ['DELETE' => 'api/students/delete.php'],

    '/api/loans' => ['GET' => 'api/loans/read.php'],
    '/api/loans/create' => ['POST' => 'api/loans/create.php'],
    '/api/loans/return' => ['POST' => 'api/loans/return.php'],
];

// Find and execute the matching route
$matched = false;

foreach ($routes as $route => $methods) {
    if ($request === $route) {
        if (isset($methods[$method])) {
            $file = $methods[$method];

            // Check if file exists
            if (file_exists($file)) {
                require_once $file;
                $matched = true;
                break;
            } else {
                error_log("File not found: " . $file);
                http_response_code(500);
                echo json_encode(["error" => "Internal server error: endpoint file missing"]);
                exit();
            }
        } else {
            // Method not allowed
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed for this endpoint"]);
            exit();
        }
    }
}

// If no route matched
if (!$matched) {
    http_response_code(404);
    echo json_encode([
        "error" => "Endpoint not found",
        "request" => $request,
        "method" => $method,
        "available_endpoints" => array_keys($routes)
    ]);
}
?>
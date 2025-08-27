<?php
echo "PHP is working!<br>";
echo "Current directory: " . __DIR__ . "<br>";
echo "Trying to include config.php...<br>";

if (file_exists('api/config.php')) {
    echo "config.php exists!<br>";
    require_once 'api/config.php';
    echo "config.php loaded successfully!<br>";
} else {
    echo "config.php not found!<br>";
}

echo "Trying to access kits folder...<br>";
if (file_exists('api/kits/read.php')) {
    echo "read.php exists!<br>";
} else {
    echo "read.php not found!<br>";
}
?>
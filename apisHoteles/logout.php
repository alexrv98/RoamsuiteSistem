<?php

require_once 'cors.php';
setcookie("auth_token", "", [
    'expires' => time() - 3600,
    'path' => '/',
    'httponly' => true,
    'secure' => false,
    'samesite' => 'Strict'
]);

echo json_encode([
    "status" => "success",
    "message" => "Sesión cerrada"
]);

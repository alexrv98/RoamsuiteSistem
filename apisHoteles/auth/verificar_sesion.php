
<?php
require_once 'cors.php';

session_set_cookie_params([
    'lifetime' => 3600,  // 1 hora
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false, // No usar HTTPS en local
    'httponly' => true,
    'samesite' => 'Lax', // O puedes dejarlo como 'Strict' si no necesitas 'None' para CORS
]);
session_start();

if (isset($_SESSION['auth_token'])) {
    echo json_encode(["status" => "success", "message" => "Usuario autenticado"]);
} else {
    echo json_encode(["status" => "error", "message" => "No autenticado"]);
}

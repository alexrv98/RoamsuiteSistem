<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Para manejar las peticiones OPTIONS de CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); 
}
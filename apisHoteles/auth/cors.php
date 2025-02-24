<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


// Para manejar las peticiones OPTIONS de CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); 
}

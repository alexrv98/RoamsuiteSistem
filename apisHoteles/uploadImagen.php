<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificar si el token es válido
    $usuario = verificarToken();

    if (!$usuario || !isset($usuario['id'])) {
        echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
        exit;
    }

    // Verificar si el archivo fue subido correctamente
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $file = $_FILES['imagen'];
        $uploadDirectory = '../assets/'; // Carpeta donde guardarás la imagen

        // Validar tipo de archivo
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($fileExtension, $allowedExtensions)) {
            echo json_encode(["status" => "error", "message" => "El archivo debe ser una imagen válida (JPG, PNG, GIF)"]);
            exit;
        }

        // Validar el tamaño del archivo (5MB máximo)
        $maxFileSize = 5 * 1024 * 1024; // 5 MB
        if ($file['size'] > $maxFileSize) {
            echo json_encode(["status" => "error", "message" => "El archivo excede el tamaño máximo permitido (5MB)."]);
            exit;
        }

        // Validar MIME type (más seguro que solo las extensiones)
        $fileMimeType = mime_content_type($file['tmp_name']);
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (!in_array($fileMimeType, $allowedMimeTypes)) {
            echo json_encode(["status" => "error", "message" => "El archivo debe ser una imagen válida (JPG, PNG, GIF)."]);
            exit;
        }

        // Generar un nombre único para el archivo
        $fileName = uniqid('img_', true) . '.' . $fileExtension;
        $filePath = $uploadDirectory . $fileName;

        // Mover el archivo a la carpeta de destino
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $imgUrl = 'assets/' . $fileName; // URL relativa de la imagen

            echo json_encode(["status" => "success", "url" => $imgUrl]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al cargar la imagen."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "No se ha enviado ninguna imagen."]);
    }
}
?>

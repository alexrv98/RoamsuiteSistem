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

    // Asegurarse de que se recibe el id de la habitación
    if (!isset($_POST['habitacion_id']) || empty($_POST['habitacion_id'])) {
        echo json_encode(["status" => "error", "message" => "ID de la habitación no proporcionado"]);
        exit;
    }

    $habitacion_id = $_POST['habitacion_id']; // ID de la habitación

    // Verificar si hay imágenes para cargar
    if (isset($_FILES['imagenes']) && !empty($_FILES['imagenes']['name'][0])) {
        $uploadDirectory = '../assets/'; // Carpeta donde guardarás las imágenes

        // Array para almacenar las URLs de las imágenes cargadas
        $uploadedUrls = [];

        // Procesar cada imagen cargada
        foreach ($_FILES['imagenes']['tmp_name'] as $index => $tmpName) {
            $file = $_FILES['imagenes'];
            $fileExtension = strtolower(pathinfo($file['name'][$index], PATHINFO_EXTENSION));
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

            // Validar tipo de archivo
            if (!in_array($fileExtension, $allowedExtensions)) {
                echo json_encode(["status" => "error", "message" => "El archivo debe ser una imagen válida (JPG, PNG, GIF)"]);
                exit;
            }

            // Validar el tamaño del archivo (5MB máximo)
            $maxFileSize = 5 * 1024 * 1024; // 5 MB
            if ($file['size'][$index] > $maxFileSize) {
                echo json_encode(["status" => "error", "message" => "El archivo excede el tamaño máximo permitido (5MB)."]);
                exit;
            }

            // Validar MIME type
            $fileMimeType = mime_content_type($tmpName);
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

            if (!in_array($fileMimeType, $allowedMimeTypes)) {
                echo json_encode(["status" => "error", "message" => "El archivo debe ser una imagen válida (JPG, PNG, GIF)."]);
                exit;
            }

            // Generar un nombre único para cada archivo
            $fileName = uniqid('img_', true) . '.' . $fileExtension;
            $filePath = $uploadDirectory . $fileName;

            // Mover el archivo a la carpeta de destino
            if (move_uploaded_file($tmpName, $filePath)) {
                $imgUrl = 'assets/' . $fileName; // URL relativa de la imagen
                $uploadedUrls[] = $imgUrl;

                // Insertar cada imagen en la base de datos
                $query = "INSERT INTO imagenes_habitacion (habitacion_id, img_url) VALUES (?, ?)";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("is", $habitacion_id, $imgUrl);

                if (!$stmt->execute()) {
                    echo json_encode(["status" => "error", "message" => "Error al agregar la imagen en la base de datos."]);
                    exit;
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Error al cargar la imagen."]);
                exit;
            }
        }

        // Responder con las URLs de las imágenes cargadas
        echo json_encode(["status" => "success", "urls" => $uploadedUrls]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se ha enviado ninguna imagen."]);
    }
}
?>

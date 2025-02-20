<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = verificarToken();

    if (!$usuario || !isset($usuario['id'])) {
        echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
        exit;
    }

    // Recibir datos de la habitación
    $hotel_id = $_POST['hotel_id'] ?? null;
    $tipo_habitacion_id = $_POST['tipo_habitacion_id'] ?? null;
    $numero_habitacion = $_POST['numero_habitacion'] ?? null;
    $precio = $_POST['precio'] ?? null;

    if (!$hotel_id || !$tipo_habitacion_id || !$numero_habitacion || !$precio) {
        echo json_encode(["status" => "error", "message" => "Todos los campos de la habitación son obligatorios"]);
        exit;
    }

    try {
        // Insertar la nueva habitación
        $queryInsert = "INSERT INTO habitaciones (hotel_id, tipo_habitacion_id, numero_habitacion, precio)
                        VALUES (:hotel_id, :tipo_habitacion_id, :numero_habitacion, :precio)";
        $stmtInsert = $conn->prepare($queryInsert);
        $stmtInsert->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        $stmtInsert->bindParam(':tipo_habitacion_id', $tipo_habitacion_id, PDO::PARAM_INT);
        $stmtInsert->bindParam(':numero_habitacion', $numero_habitacion, PDO::PARAM_STR);
        $stmtInsert->bindParam(':precio', $precio, PDO::PARAM_STR);
        $stmtInsert->execute();

        // Obtener el ID de la habitación recién insertada
        $habitacion_id = $conn->lastInsertId();

        // Manejo de imágenes
        if (isset($_FILES['imagenes']) && !empty($_FILES['imagenes']['name'][0])) {
            $uploadDirectory = '../assets/'; // Carpeta donde se guardarán las imágenes
            $uploadedUrls = [];

            foreach ($_FILES['imagenes']['tmp_name'] as $index => $tmpName) {
                $file = $_FILES['imagenes'];
                $fileExtension = strtolower(pathinfo($file['name'][$index], PATHINFO_EXTENSION));
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

                if (!in_array($fileExtension, $allowedExtensions)) {
                    echo json_encode(["status" => "error", "message" => "Solo se permiten imágenes JPG, PNG o GIF"]);
                    exit;
                }

                $fileName = uniqid('img_', true) . '.' . $fileExtension;
                $filePath = $uploadDirectory . $fileName;

                if (move_uploaded_file($tmpName, $filePath)) {
                    $imgUrl = 'assets/' . $fileName;
                    $uploadedUrls[] = $imgUrl;

                    // Guardar la imagen en la base de datos
                    $queryImagen = "INSERT INTO imagenes_habitacion (habitacion_id, img_url) VALUES (:habitacion_id, :img_url)";
                    $stmtImagen = $conn->prepare($queryImagen);
                    $stmtImagen->bindParam(':habitacion_id', $habitacion_id, PDO::PARAM_INT);
                    $stmtImagen->bindParam(':img_url', $imgUrl, PDO::PARAM_STR);
                    $stmtImagen->execute();
                } else {
                    echo json_encode(["status" => "error", "message" => "Error al subir la imagen"]);
                    exit;
                }
            }
        }

        echo json_encode(["status" => "success", "message" => "Habitación agregada con imágenes correctamente"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error al agregar la habitación: " . $e->getMessage()]);
    }
}
?>

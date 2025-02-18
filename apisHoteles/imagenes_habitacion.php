<?php
require_once 'cors.php';
require_once 'db.php';

// Verificar el método de la solicitud
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verificar si se ha proporcionado el ID de la habitación
    if (isset($_GET['habitacion_id'])) {
        $habitacion_id = $_GET['habitacion_id'];

        try {
            // Consultar las imágenes asociadas a la habitación
            $query = "SELECT i.id, i.img_url
                      FROM imagenes_habitacion i
                      WHERE i.habitacion_id = :habitacion_id";

            $stmt = $conn->prepare($query);
            $stmt->execute([':habitacion_id' => $habitacion_id]);
            $imagenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Verificar si se encontraron imágenes
            if ($imagenes) {
                // URL base de tu dominio
                $base_url = "http://localhost:4200/"; // Cambia esto por la URL base de tu servidor

                // Añadir la URL completa a las imágenes y eliminar saltos de línea o espacios en blanco innecesarios
                foreach ($imagenes as &$imagen) {
                    // Eliminar cualquier salto de línea o espacio en blanco adicional
                    $imagen['img_url'] = trim($base_url . $imagen['img_url']);
                }

                echo json_encode(['status' => 'success', 'data' => $imagenes]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No se encontraron imágenes para esta habitación']);
            }

        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Error al obtener las imágenes: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'ID de habitación no proporcionado']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Solo GET es válido.']);
}
?>

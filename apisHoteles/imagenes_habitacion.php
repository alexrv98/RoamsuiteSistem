<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Obtener el habitacion_id de los parámetros de la URL
    $habitacion_id = isset($_GET['habitacion_id']) ? intval($_GET['habitacion_id']) : null;

    if ($habitacion_id === null) {
        echo json_encode([
            "status" => "error",
            "message" => "El parámetro habitacion_id es obligatorio"
        ]);
        exit;
    }

    try {
        // Consulta para obtener las imágenes asociadas al habitacion_id
        $query = "SELECT i.id AS imagen_id, i.img_url
                  FROM imagenes_habitacion i
                  WHERE i.habitacion_id = :habitacion_id";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(':habitacion_id', $habitacion_id, PDO::PARAM_INT);
        $stmt->execute();
        $imagenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si se encontraron imágenes
        if (count($imagenes) > 0) {
            echo json_encode([
                "status" => "success",
                "data" => $imagenes
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "No se encontraron imágenes para la habitación solicitada"
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al obtener imágenes: " . $e->getMessage()
        ]);
    }
}
?>

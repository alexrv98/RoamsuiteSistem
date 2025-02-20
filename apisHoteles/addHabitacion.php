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

    $data = json_decode(file_get_contents("php://input"), true);
    $hotel_id = $data['hotel_id'] ?? null;
    $tipo_habitacion_id = $data['tipo_habitacion_id'] ?? null;
    $numero_habitacion = $data['numero_habitacion'] ?? null;
    $precio = $data['precio'] ?? null;
    $img_url = $data['img_url'] ?? null;  // URL de la imagen

    if (!$hotel_id || !$tipo_habitacion_id || !$numero_habitacion || !$precio || !$img_url) {
        echo json_encode(["status" => "error", "message" => "Todos los campos son obligatorios"]);
        exit;
    }

    try {
        // Obtener la capacidad total actual del hotel
        $queryCapacidad = "SELECT SUM(t.capacidad) AS capacidad_ocupada
                           FROM habitaciones h
                           INNER JOIN tipos_habitacion t ON h.tipo_habitacion_id = t.id
                           WHERE h.hotel_id = :hotel_id";
        $stmtCapacidad = $conn->prepare($queryCapacidad);
        $stmtCapacidad->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        $stmtCapacidad->execute();
        $capacidadOcupada = $stmtCapacidad->fetch(PDO::FETCH_ASSOC)['capacidad_ocupada'] ?? 0;

        // Obtener la capacidad máxima del hotel
        $queryHotel = "SELECT capacidad FROM hoteles WHERE id = :hotel_id";
        $stmtHotel = $conn->prepare($queryHotel);
        $stmtHotel->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        $stmtHotel->execute();
        $capacidadMaxima = $stmtHotel->fetch(PDO::FETCH_ASSOC)['capacidad'] ?? 0;

        // Obtener la capacidad de la nueva habitación
        $queryHabitacion = "SELECT capacidad FROM tipos_habitacion WHERE id = :tipo_habitacion_id";
        $stmtHabitacion = $conn->prepare($queryHabitacion);
        $stmtHabitacion->bindParam(':tipo_habitacion_id', $tipo_habitacion_id, PDO::PARAM_INT);
        $stmtHabitacion->execute();
        $capacidadNueva = $stmtHabitacion->fetch(PDO::FETCH_ASSOC)['capacidad'] ?? 0;

        if (($capacidadOcupada + $capacidadNueva) > $capacidadMaxima) {
            echo json_encode(["status" => "error", "message" => "No se puede agregar la habitación. Se supera la capacidad máxima del hotel."]);
            exit;
        }

        // Obtener el último ID utilizado en habitaciones
        $queryMaxHabitacionId = "SELECT MAX(id) AS max_id FROM habitaciones";
        $stmtMaxHabitacionId = $conn->prepare($queryMaxHabitacionId);
        $stmtMaxHabitacionId->execute();
        $maxHabitacionId = $stmtMaxHabitacionId->fetch(PDO::FETCH_ASSOC)['max_id'] ?? 0;

        // Insertar la nueva habitación
        $queryInsertHabitacion = "INSERT INTO habitaciones (hotel_id, tipo_habitacion_id, numero_habitacion, precio)
                                  VALUES (:hotel_id, :tipo_habitacion_id, :numero_habitacion, :precio)";
        $stmtInsertHabitacion = $conn->prepare($queryInsertHabitacion);
        $stmtInsertHabitacion->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        $stmtInsertHabitacion->bindParam(':tipo_habitacion_id', $tipo_habitacion_id, PDO::PARAM_INT);
        $stmtInsertHabitacion->bindParam(':numero_habitacion', $numero_habitacion, PDO::PARAM_STR);
        $stmtInsertHabitacion->bindParam(':precio', $precio, PDO::PARAM_STR);
        $stmtInsertHabitacion->execute();

        // Obtener el ID de la habitación recién insertada
        $habitacion_id = $conn->lastInsertId();

        // Obtener el último ID utilizado en imagenes_habitacion
        $queryMaxImagenId = "SELECT MAX(id) AS max_id FROM imagenes_habitacion";
        $stmtMaxImagenId = $conn->prepare($queryMaxImagenId);
        $stmtMaxImagenId->execute();
        $maxImagenId = $stmtMaxImagenId->fetch(PDO::FETCH_ASSOC)['max_id'] ?? 0;

        // Insertar la imagen de la habitación
        $queryInsertImagen = "INSERT INTO imagenes_habitacion (habitacion_id, img_url)
                              VALUES (:habitacion_id, :img_url)";
        $stmtInsertImagen = $conn->prepare($queryInsertImagen);
        $stmtInsertImagen->bindParam(':habitacion_id', $habitacion_id, PDO::PARAM_INT);
        $stmtInsertImagen->bindParam(':img_url', $img_url, PDO::PARAM_STR);
        $stmtInsertImagen->execute();

        echo json_encode(["status" => "success", "message" => "Habitación agregada exitosamente."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error al agregar habitación: " . $e->getMessage()]);
    }
}
?>

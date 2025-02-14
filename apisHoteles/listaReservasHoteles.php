<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener el token del encabezado
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        echo json_encode(["status" => "error", "message" => "Token no proporcionado"]);
        exit;
    }

    $token = str_replace("Bearer ", "", $headers['Authorization']);
    $usuario = verificarToken($token);

    if (!$usuario) {
        echo json_encode(["status" => "error", "message" => "Token inválido"]);
        exit;
    }

    $admin_id = $usuario['id'];

    try {
        // Debug para verificar el usuario ID
        error_log("Usuario Admin ID: " . $admin_id);

        // Obtener el hotel asignado al administrador
        $stmt = $conn->prepare("SELECT id FROM hoteles WHERE usuario_id = :admin_id LIMIT 1");
        $stmt->bindParam(':admin_id', $admin_id, PDO::PARAM_INT);
        $stmt->execute();
        $hotel = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$hotel) {
            echo json_encode(["status" => "error", "message" => "No se encontró un hotel asignado al administrador"]);
            exit;
        }

        $hotel_id = $hotel['id'];

        // Debug para verificar el hotel ID
        error_log("Hotel ID encontrado: " . $hotel_id);

        // Obtener las reservaciones del hotel asignado con el nombre del usuario que hizo la reservación
        $stmt = $conn->prepare(
            "SELECT r.id as reservacion_id,
                    h.numero_habitacion,
                    t.nombre as tipo_habitacion,
                    t.capacidad,
                    t.camas,
                    h.precio,
                    r.fecha_inicio,
                    r.fecha_fin,
                    r.estado,
                    r.total_a_pagar,
                    DATEDIFF(r.fecha_fin, r.fecha_inicio) AS total_dias_hospedaje,
                    ho.id as hotel_id,
                    ho.nombre as nombre_hotel,
                    lt.nombre as nombre_lugar_turistico,
                    u.nombre as nombre_usuario,
                    u.correo as correo_usuario
             FROM reservaciones r
             INNER JOIN habitaciones h ON r.habitacion_id = h.id
             INNER JOIN tipos_habitacion t ON h.tipo_habitacion_id = t.id
             INNER JOIN hoteles ho ON h.hotel_id = ho.id
             INNER JOIN lugares_turisticos lt ON ho.lugar_id = lt.id
             INNER JOIN usuarios u ON r.usuario_id = u.id
             WHERE ho.id = :hotel_id"
        );

        $stmt->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        $stmt->execute();
        $reservaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => "success", "data" => $reservaciones]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error al obtener las reservaciones: " . $e->getMessage()]);
    }
}
?>

<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $usuario = verificarToken();

    if (!$usuario || !isset($usuario['id'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Usuario no autenticado"
        ]);
        exit;
    }

    $hotel_id = isset($_GET['hotel_id']) ? intval($_GET['hotel_id']) : null;

    try {
        $query = "SELECT r.id AS reservacion_id, r.fecha_inicio, r.fecha_fin, r.estado,
                         h.id AS habitacion_id, h.numero_habitacion, h.precio,
                         ho.id AS hotel_id, ho.nombre AS hotel_nombre, ho.direccion
                  FROM reservaciones r
                  INNER JOIN habitaciones h ON r.habitacion_id = h.id
                  INNER JOIN hoteles ho ON h.hotel_id = ho.id
                  WHERE r.usuario_id = :usuario_id";

        if ($hotel_id) {
            $query .= " AND ho.id = :hotel_id";
        }

        $stmt = $conn->prepare($query);
        $stmt->bindParam(':usuario_id', $usuario['id'], PDO::PARAM_INT);
        if ($hotel_id) {
            $stmt->bindParam(':hotel_id', $hotel_id, PDO::PARAM_INT);
        }
        $stmt->execute();
        $reservaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "data" => $reservaciones
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al obtener reservaciones: " . $e->getMessage()
        ]);
    }
}
?>

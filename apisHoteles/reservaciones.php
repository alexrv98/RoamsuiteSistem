<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

// Verificar el token
$usuario = verificarToken(); 

// Verificar el método de la solicitud
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($usuario) {
        // Leer los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);

        // Verificar que los datos estén completos
        if (
            !$data ||
            !isset($data['usuario_id']) ||
            !isset($data['habitacion_id']) ||
            !isset($data['fechaInicio']) ||
            !isset($data['fechaFin']) ||
            !isset($data['totalReserva'])
        ) {
            echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
            exit;
        }

        // Asignar variables
        $usuario_id = $data['usuario_id'];
        $habitacion_id = $data['habitacion_id'];
        $fechaInicio = $data['fechaInicio'];
        $fechaFin = $data['fechaFin'];
        $totalReserva = $data['totalReserva'];

        try {
            // Insertar la reserva en la base de datos
            $stmt = $conn->prepare("INSERT INTO reservaciones (usuario_id, habitacion_id, fecha_inicio, fecha_fin, total_a_pagar, estado) VALUES (:usuario_id, :habitacion_id, :fechaInicio, :fechaFin, :totalReserva, 'pendiente')");
            $stmt->execute([
                ':usuario_id' => $usuario_id,
                ':habitacion_id' => $habitacion_id,
                ':fechaInicio' => $fechaInicio,
                ':fechaFin' => $fechaFin,
                ':totalReserva' => $totalReserva
            ]);

            echo json_encode(['status' => 'success', 'message' => 'Reserva realizada con éxito']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
        }
    } else {
        // Token inválido
        echo json_encode(['status' => 'error', 'message' => 'Token inválido o expirado']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener reservaciones
    if ($usuario) {
        try {
            $query = "SELECT r.id, r.usuario_id, u.nombre AS usuario_nombre, r.habitacion_id, h.tipo AS tipo_habitacion, r.fecha_inicio, r.fecha_fin, r.total_a_pagar, r.estado
                      FROM reservaciones r
                      JOIN usuarios u ON r.usuario_id = u.id
                      JOIN habitaciones h ON r.habitacion_id = h.id";

            $stmt = $conn->prepare($query);
            $stmt->execute();
            $reservaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['status' => 'success', 'data' => $reservaciones]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Error al obtener reservaciones: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Token inválido o expirado']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Solo GET y POST son válidos.']);
}
?>

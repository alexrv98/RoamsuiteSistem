<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

// Verificar el token
$usuario = verificarToken(); 

// Asegurarnos de que la solicitud sea un POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Solo POST es válido.']);
    exit;
}

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
        !isset($data['num_adultos']) ||
        !isset($data['num_ninos']) ||
        !isset($data['totalReserva'])
    ) {
        echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
        exit;
    }

    // Asignar las variables
    $usuario_id = $data['usuario_id'];
    $habitacion_id = $data['habitacion_id'];
    $fechaInicio = $data['fechaInicio'];
    $fechaFin = $data['fechaFin'];
    $totalReserva = $data['totalReserva'];
    $num_adultos = $data['num_adultos'];
    $num_ninos = $data['num_ninos'];

    try {
        // Insertar la reserva en la base de datos
        $stmt = $conn->prepare("INSERT INTO reservaciones (usuario_id, habitacion_id, fecha_inicio, fecha_fin, total_a_pagar, num_adultos, num_ninos, estado) VALUES (:usuario_id, :habitacion_id, :fechaInicio, :fechaFin, :totalReserva, :num_adultos, :num_ninos 'pendiente')");
        $stmt->execute([
            ':usuario_id' => $usuario_id,
            ':habitacion_id' => $habitacion_id,
            ':fechaInicio' => $fechaInicio,
            ':fechaFin' => $fechaFin,
            ':totalReserva' => $totalReserva,
            ':num_adultos' => $num_adultos,
            ':num_ninos' => $num_ninos

        ]);

        echo json_encode(['status' => 'success', 'message' => 'Reserva realizada con éxito']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
} else {
    // Si el token no es válido o ha expirado
    echo json_encode(['status' => 'error', 'message' => 'Token inválido o expirado']);
}
?>

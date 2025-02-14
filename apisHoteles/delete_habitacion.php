<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $usuario = verificarToken();

    if (!$usuario || !isset($usuario['id'])) {
        echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
        exit;
    }

    // Leer los datos enviados en el cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"), true);
    $habitacion_id = $data['id'] ?? null;

    if (!$habitacion_id) {
        echo json_encode(["status" => "error", "message" => "ID de habitación requerido"]);
        exit;
    }

    try {
        // Verificar si la habitación tiene reservas activas
        $queryCheck = "SELECT COUNT(*) as total FROM reservaciones WHERE habitacion_id = :habitacion_id";
        $stmtCheck = $conn->prepare($queryCheck);
        $stmtCheck->bindParam(':habitacion_id', $habitacion_id, PDO::PARAM_INT);
        $stmtCheck->execute();
        $reservas = $stmtCheck->fetch(PDO::FETCH_ASSOC)['total'];

        if ($reservas > 0) {
            echo json_encode(["status" => "error", "message" => "No se puede eliminar la habitación, tiene reservas asociadas."]);
            exit;
        }

        // Si no hay reservas, eliminar la habitación
        $queryDelete = "DELETE FROM habitaciones WHERE id = :habitacion_id";
        $stmtDelete = $conn->prepare($queryDelete);
        $stmtDelete->bindParam(':habitacion_id', $habitacion_id, PDO::PARAM_INT);
        $stmtDelete->execute();

        echo json_encode(["status" => "success", "message" => "Habitación eliminada correctamente."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error al eliminar habitación: " . $e->getMessage()]);
    }
}
?>

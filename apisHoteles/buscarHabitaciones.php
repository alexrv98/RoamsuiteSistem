<?php
require_once 'cors.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $data = json_decode($inputJSON, true);

    $hotelId = $data['hotelId'];
    $fechaInicio = $data['fechaInicio'];
    $fechaFin = $data['fechaFin'];
    $huespedes = $data['huespedes'];

    try {
        // Primero, buscamos habitaciones con la mejor capacidad para los huéspedes
        $stmt = $conn->prepare("
            SELECT 
                ha.id AS habitacion_id,
                ha.numero_habitacion,
                th.nombre AS tipo_habitacion,
                th.capacidad,
                th.camas,
                ha.precio
            FROM habitaciones ha
            JOIN tipos_habitacion th ON ha.tipo_habitacion_id = th.id
            WHERE ha.hotel_id = :hotelId
            AND th.capacidad >= :huespedes
            AND ha.id NOT IN (
                SELECT r.habitacion_id 
                FROM reservaciones r
                WHERE (r.fecha_inicio <= :fechaFin AND r.fecha_fin >= :fechaInicio)
            )
            ORDER BY th.capacidad DESC  -- Preferir las habitaciones más adecuadas a la cantidad de huéspedes
        ");

        $stmt->bindParam(':hotelId', $hotelId, PDO::PARAM_INT);
        $stmt->bindParam(':fechaInicio', $fechaInicio, PDO::PARAM_STR);
        $stmt->bindParam(':fechaFin', $fechaFin, PDO::PARAM_STR);
        $stmt->bindParam(':huespedes', $huespedes, PDO::PARAM_INT);

        $stmt->execute();

        $habitacionesDisponibles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $mejorOpcion = [];
        $otrasHabitaciones = [];

        foreach ($habitacionesDisponibles as $habitacion) {
            if ($habitacion['capacidad'] == $huespedes) {
                $mejorOpcion[] = $habitacion;  // La habitación que tiene la capacidad exacta
            } else {
                $otrasHabitaciones[] = $habitacion;  // Las otras habitaciones disponibles
            }
        }

        echo json_encode([
            "status" => "success",
            "data" => [
                "mejorOpcion" => $mejorOpcion,
                "otrasHabitaciones" => $otrasHabitaciones
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al obtener habitaciones: " . $e->getMessage()
        ]);
    }
}
?>

<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt_verify.php';

$usuario = verificarToken(); 

if ($usuario) {
    $id = $usuario['id']; 
    try {
        
        $stmt = $conn->prepare("SELECT id, nombre, correo FROM Usuarios WHERE id = :id AND activo = 1");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode([
                'status' => 'success',
                'usuario' => $user
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Usuario no encontrado'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error en la base de datos: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Token inválido o expirado'
    ]);
}
?>

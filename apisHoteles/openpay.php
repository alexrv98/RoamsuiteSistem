<?php
header('Content-Type: application/json');
require 'vendor/autoload.php'; // Cargar SDK de Openpay

use Openpay\Data\Openpay;

// 1️⃣ Configurar Openpay
$OPENPAY_MERCHANT_ID = 'TU_ID_DE_COMERCIO';
$OPENPAY_PRIVATE_KEY = 'TU_LLAVE_PRIVADA';
$SANDBOX_MODE = true; // Cambia a false en producción

// Asegurar que las credenciales están bien
if (!$OPENPAY_MERCHANT_ID || !$OPENPAY_PRIVATE_KEY) {
  echo json_encode(['error' => 'Faltan credenciales de Openpay']);
  exit;
}

Openpay::setId($OPENPAY_MERCHANT_ID);
Openpay::setApiKey($OPENPAY_PRIVATE_KEY);
Openpay::setProductionMode(!$SANDBOX_MODE);

// 2️⃣ Recibir datos del pago
$json = json_decode(file_get_contents("php://input"), true);
if (!isset($json['token']) || !isset($json['monto'])) {
  echo json_encode(['error' => 'Faltan datos']);
  exit;
}

$token = $json['token'];
$monto = floatval($json['monto']);

try {
  // 3️⃣ Crear cliente
  $customer = [
    'name' => 'Cliente',
    'last_name' => 'Prueba',
    'email' => 'cliente@email.com',
    'phone_number' => '5555555555'
  ];

  // 4️⃣ Crear el cargo
  $chargeData = [
    'method' => 'card',
    'source_id' => $token,
    'amount' => $monto,
    'currency' => 'MXN',
    'description' => 'Pago en mi tienda',
    'device_session_id' => null,
    'customer' => $customer
  ];

  $openpay = new Openpay($OPENPAY_MERCHANT_ID, $OPENPAY_PRIVATE_KEY); // 🔹 CORREGIDO
  $charge = $openpay->charges->create($chargeData);

  // 5️⃣ Respuesta exitosa
  echo json_encode(['status' => 'success', 'charge_id' => $charge->id]);
} catch (Exception $e) {
  echo json_encode(['error' => $e->getMessage()]);
}
?>
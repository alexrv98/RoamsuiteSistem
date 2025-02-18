import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var OpenPay: any; // Para acceder a la API global de Openpay

@Injectable({
  providedIn: 'root',
})
export class OpenpayService {
  private openpayKey = 'pk_754b3e371d0d416ebf36ae68a69d1d02';
  private merchantId = '20526984';
  private backendUrl = 'http://localhost/apisHoteles/openpay.php'; // Ruta a tu backend PHP

  constructor(private http: HttpClient) {
    (window as any).OpenPay.setId(this.merchantId);
    (window as any).OpenPay.setApiKey(this.openpayKey);
    (window as any).OpenPay.setSandboxMode(true); // Cambiar a false en producción
  }

  generarToken(tarjeta: any): Promise<string> {
    return new Promise((resolve, reject) => {
      (window as any).OpenPay.token.create(
        tarjeta,
        (res: any) => {
          resolve(res.data.id);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  realizarPago(
    token: string,
    monto: number,
    deviceSessionId: string,
    usuario: any
  ) {
    return this.http.post(this.backendUrl, {
      token,
      monto,
      deviceSessionId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
    });
  }
}

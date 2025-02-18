import { Injectable } from '@angular/core';

declare var OpenPay: any; // Para acceder a la API global de Openpay

@Injectable({
  providedIn: 'root',
})
export class OpenpayService {
  constructor() {
    OpenPay.setId('20526984');
    OpenPay.setApiKey('pk_754b3e371d0d416ebf36ae68a69d1d02');
    OpenPay.setSandboxMode(true); // Cambia a false en producción
  }

  generarToken(tarjeta: any): Promise<string> {
    return new Promise((resolve, reject) => {
      OpenPay.token.create(
        tarjeta,
        (response: any) => {
          resolve(response.data.id);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }
}

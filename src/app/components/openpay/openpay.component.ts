import { Component } from '@angular/core';
import { OpenpayService } from '../../services/openpay.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-openpay',
  imports: [CommonModule, FormsModule],
  templateUrl: './openpay.component.html',
  styleUrl: './openpay.component.css',
})
export class OpenpayComponent {
  tarjeta = {
    card_number: '',
    holder_name: '',
    expiration_month: '',
    expiration_year: '',
    cvv2: '',
  };
  usuario = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
  };
  monto = 100;
  mensaje = '';

  constructor(private openpayService: OpenpayService) {}

  async pagar() {
    try {
      let deviceSessionId = (window as any).OpenPay.deviceData.setup(
        'form-pago',
        'device_session_id'
      );
      const token = await this.openpayService.generarToken(this.tarjeta);
      this.openpayService
        .realizarPago(token, this.monto, deviceSessionId, this.usuario)
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.mensaje = 'Pago realizado con éxito';
          } else {
            this.mensaje = 'Error en el pago';
          }
        });
    } catch (error) {
      this.mensaje = 'Error generando token de tarjeta';
    }
  }
}

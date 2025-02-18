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
    numero: '',
    expiracion: '',
    cvv: '',
  };

  constructor(private openpayService: OpenpayService) {}

  async procesarPago() {
    const tarjetaData = {
      card_number: this.tarjeta.numero,
      holder_name: 'Nombre del titular',
      expiration_month: this.tarjeta.expiracion.split('/')[0],
      expiration_year: `20${this.tarjeta.expiracion.split('/')[1]}`,
      cvv2: this.tarjeta.cvv,
    };

    try {
      const token = await this.openpayService.generarToken(tarjetaData);
      console.log('Token generado:', token);
      // Aquí puedes enviar el token a tu backend para procesar el pago
    } catch (error) {
      console.error('Error al generar el token:', error);
    }
  }
}

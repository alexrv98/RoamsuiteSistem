import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { loadScript } from '@paypal/paypal-js';

@Component({
  selector: 'app-confirmacion-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './confirmacion-reserva.component.html',
  styleUrls: ['./confirmacion-reserva.component.css'],
})
export class ConfirmarReservaComponent implements OnInit {
  @Input() filtros: any = null;

  reserva: any;
  paypal: any;
  cliente = { nombre: '', email: '', telefono: '' };
  pagoRealizado: boolean = false;

  constructor(
    private router: Router,
    private reservaService: ReservaService,
    private location: Location
  ) {}

  ngOnInit() {
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop')?.remove();
    document.body.style.overflow = 'auto';

    const state = history.state;

    if (state.reserva) {
      this.reserva = state.reserva;
      this.location.replaceState('/confirmar-reserva', '');

      if (!this.paypal) {
        this.cargarPaypalScript();
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (
      !this.pagoRealizado ||
      !this.cliente.nombre ||
      !this.cliente.email ||
      !this.cliente.telefono
    ) {
      $event.returnValue = true;
    }
  }

>>>>>>> 017e74ad6499d4b36448f2f173261329a024bd7d
  cargarPaypalScript() {
    if (window.paypal) {
      this.paypal = window.paypal;
      this.renderizarBotonPago();
      return;
    }

    const scriptUrl =
      'https://www.paypal.com/sdk/js?client-id=AWIzDf7xorUxwwhL-i8PFdB4g4rO7r6y9quBVumXa8bllB86EiqsIXKtiPcCq8JqItGU1mWF0Xinoigs&components=buttons&currency=MXN&_=${new Date().getTime()}';

    const scriptElement = document.createElement('script');
    scriptElement.src = scriptUrl;
    scriptElement.onload = () => {
      this.renderizarBotonPago();
    };
    document.body.appendChild(scriptElement);
  }

  renderizarBotonPago() {
    if (!document.getElementById('paypal-button-container')?.hasChildNodes()) {
      this.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.reserva.totalReserva.toString(),
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert('Pago realizado con éxito');
              this.pagoRealizado = true;
            });
          },
          onError: (error: any) => {
            console.error('Error en el proceso de pago:', error);
            alert('Error al realizar el pago, intenta de nuevo.');
          },
        })
        .render('#paypal-button-container');
    }
  }

  confirmarReserva() {
    if (
      this.pagoRealizado &&
      this.cliente.nombre &&
      this.cliente.email &&
      this.cliente.telefono
    ) {
      this.reservaService.obtenerToken().subscribe(
        (response) => {
          if (response.status === 'success') {
            const token = response.token; // Recibe el token desde la API

            const datosReserva = {
              ...this.reserva,
              nombre: this.cliente.nombre,
              email: this.cliente.email,
              telefono: this.cliente.telefono,
            };

            this.reservaService.realizarReserva(datosReserva, token).subscribe(
              (res) => {
                if (res.status === 'success') {
                  alert('Reserva confirmada con éxito');
                  sessionStorage.removeItem('reservaValida');
                  this.router.navigate(['/'], { replaceUrl: true });
                } else {
                  alert('Error al realizar la reserva');
                }
              },
              (error) => {
                console.error('Error en la reserva:', error);
              }
            );
          } else {
            alert('Error al obtener el token');
          }
        },
        (error) => {
          console.error('Error al obtener el token:', error);
        }
      );
    } else {
      alert(
        'Por favor, completa todos los campos y realiza el pago antes de confirmar.'
      );
    }
  }
}

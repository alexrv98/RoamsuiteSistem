import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

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
  cliente = { id: '', nombre: '', correo: '' };
  pagoRealizado: boolean = false;

  constructor(
    private router: Router,
    private reservaService: ReservaService,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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

      const token = this.authService.getToken();
      if (token) {
        this.authService.obtenerUsuarioLogueado(token)
          .pipe(take(1)) // Evita fugas de memoria
          .subscribe({
            next: (response) => {
              console.log('Respuesta de la API:', response);
              if (response.status === 'success') {
                this.cliente = response.usuario;
              } else {
                console.error('No se pudo obtener la información del usuario');
              }
            },
            error: (error) => {
              console.error('Error al obtener los datos del usuario:', error);
            }
          });
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (!this.pagoRealizado || !this.cliente.nombre || !this.cliente.correo) {
      $event.returnValue = true;
    }
  }

  cargarPaypalScript() {
    if ((window as any).paypal) {
      this.paypal = (window as any).paypal;
      this.renderizarBotonPago();
      return;
    }
    

    const scriptUrl =
      'https://www.paypal.com/sdk/js?client-id=AWIzDf7xorUxwwhL-i8PFdB4g4rO7r6y9quBVumXa8bllB86EiqsIXKtiPcCq8JqItGU1mWF0Xinoigs&components=buttons&currency=MXN';

    const scriptElement = document.createElement('script');
    scriptElement.src = scriptUrl;
    scriptElement.onload = () => {
      this.paypal = (window as any).paypal;
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
                  amount: { value: this.reserva.totalReserva.toString() },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then(() => {
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

  confirmarReserva(): void {
    if (this.pagoRealizado && this.cliente.nombre && this.cliente.correo) {
      const datosReserva = {
        usuario_id: this.cliente.id,
        habitacion_id: this.reserva.habitacion_id,
        fechaInicio: this.reserva.fechaInicio,
        fechaFin: this.reserva.fechaFin,
        totalReserva: this.reserva.totalReserva,
        nombre: this.cliente.nombre,
        email: this.cliente.correo,
      };

      this.reservaService.realizarReserva(datosReserva)
        .pipe(take(1)) 
        .subscribe({
          next: (res) => {
            if (res.status === 'success') {
              alert('Reserva confirmada con éxito');
              sessionStorage.removeItem('reservaValida');
              this.router.navigate(['/'], { replaceUrl: true });
            } else {
              alert('Error al realizar la reserva');
            }
          },
          error: (error) => {
            console.error('Error en la reserva:', error);
          }
        });
    } else {
      alert('Por favor, completa todos los campos y realiza el pago antes de confirmar.');
    }
  }
}

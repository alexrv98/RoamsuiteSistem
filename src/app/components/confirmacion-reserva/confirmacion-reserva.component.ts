import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
import { OpenpayComponent } from '../openpay/openpay.component';

@Component({
  selector: 'app-confirmacion-reserva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    OpenpayComponent,
  ],
  templateUrl: './confirmacion-reserva.component.html',
  styleUrls: ['./confirmacion-reserva.component.css'],
})
export class ConfirmarReservaComponent implements OnInit {
  reserva: any;
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
      console.log(this.reserva.filtros?.fechaInicio, this.reserva.filtros?.fechaFin);

      this.location.replaceState('/confirmar-reserva', '');

      const token = this.authService.getToken();
      if (token) {
        this.authService
          .obtenerUsuarioLogueado(token)
          .pipe(take(1))
          .subscribe({
            next: (response) => {
              if (response.status === 'success') {
                this.cliente = response.usuario;
              } else {
                console.error('No se pudo obtener la información del usuario');
              }
            },
            error: (error) => {
              console.error('Error al obtener los datos del usuario:', error);
            },
          });
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  actualizarEstadoPago(transactionId: string) {
    if (transactionId) {
      this.pagoRealizado = true;
      this.reserva.id_transaccion = transactionId; 
    } else {
      console.error('Error: No se recibió un ID de transacción válido.');
    }
  }
  
  confirmarReserva(): void {
    if (this.pagoRealizado && this.cliente.nombre && this.cliente.correo) {
      const datosReserva = {
        usuario_id: this.cliente.id,
        habitacion_id: this.reserva.habitacion?.habitacion_id || null,
        fechaInicio: this.reserva.filtros?.fechaInicio || null,
        fechaFin: this.reserva.filtros?.fechaFin || null,
        totalReserva: this.reserva.habitacion?.precio_calculado || 0,
        num_adultos: this.reserva.habitacion?.adultosExtras || 0,
        num_ninos: this.reserva.habitacion?.ninosExtras || 0,
        id_transaccion: this.reserva.id_transaccion || 'No asignado'
      };
  
  
      this.reservaService.realizarReserva(datosReserva).pipe(take(1)).subscribe({
        next: (res) => {
  
          if (res.status === 'success') {
            alert('Reserva confirmada con éxito');
            this.router.navigate(['/'], { replaceUrl: true });
          } else {
            alert('Error al realizar la reserva');
          }
        },
        error: (error) => {
          console.error('Error en la reserva:', error);
        },
      });
    } else {
      alert('Por favor, completa todos los campos y realiza el pago antes de confirmar.');
    }
  }
  
  
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-misreservas',
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css',
})
export class MisReservasComponent implements OnInit {
  reservaciones: any[] = [];
  reservacionSeleccionada: any;
  estados = ['pendiente', 'confirmada', 'cancelada'];
  isLoading: boolean = true; // Indicador de carga

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.obtenerReservaciones();
  }
  
  obtenerReservaciones(): void {
    this.reservaService.obtenerReservacionesUsuario().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.reservaciones = response.data;
        } else {
          console.error('Error al obtener las reservaciones', response.message);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error de conexión con la API', error);
        this.isLoading = false; 
      },
      complete: () => {
        console.log('Petición de reservaciones completada');
      }
    });
  }
  
}

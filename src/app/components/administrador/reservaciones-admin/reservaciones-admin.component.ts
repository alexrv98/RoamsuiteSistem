import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../services/reserva.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-reservaciones-admin',
  templateUrl: './reservaciones-admin.component.html',
  imports:[CommonModule, NavbarComponent],
  styleUrls: ['./reservaciones-admin.component.css']
})
export class ReservacionesAdminComponent implements OnInit {
  reservaciones: any[] = [];
  nombreHotel: string = '';


  constructor(
    private reservacionService: ReservaService
  ) {}

  ngOnInit(): void {
    this.reservacionService.obtenerReservacionesAdmin().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.reservaciones = response.data;

          if (this.reservaciones.length > 0) {
            this.nombreHotel = this.reservaciones[0].nombre_hotel;
          }
        } else {
          console.error('No se encontraron reservaciones:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar las reservaciones:', error);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
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

  constructor(
    private authService: AuthService,
    private reservacionService: ReservaService
  ) {}

  ngOnInit(): void {
    this.reservacionService.obtenerReservacionesAdmin().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.reservaciones = response.data;
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

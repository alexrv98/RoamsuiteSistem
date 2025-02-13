import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-misreservas',
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css',
})
export class MisReservasComponent implements OnInit {
  comentarios: any[] = [];
  nuevoComentario = { texto: '', calificacion: 0, hotelId: null };
  estrellas = [1, 2, 3, 4, 5];
  comentariosMostrados = 2;
  estaAutenticado: boolean = false;
  reservaciones: any[] = [];
  
  isLoading: boolean = true; 

  constructor(
    private authService: AuthService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.verificarUsuario();
  }

  verificarUsuario(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.estaAutenticado = false;
      console.log('Usuario no autenticado: no hay token');
      return;
    }

    this.authService.obtenerUsuarioLogueado(token).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.usuario) {
          this.estaAutenticado = true;
          this.cargarReservaciones();
        } else {
          this.estaAutenticado = false;
        }
      },
      error: (error) => {
        this.estaAutenticado = false;
        console.error('Error al verificar usuario:', error);
      },
    });
  }

  cargarReservaciones(): void {
    this.isLoading = true;
    this.reservaService.obtenerReservacionesUsuario().subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.reservaciones = response.data;
        } else {
          console.warn('No se encontraron reservas o formato incorrecto.');
          this.reservaciones = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener reservas:', error);
        this.reservaciones = [];
        this.isLoading = false;
      },
    });
  }
  
}

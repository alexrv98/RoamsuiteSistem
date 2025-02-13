import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../../services/comentarios.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-misreservas',
  imports: [CommonModule,FormsModule, RouterLink],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css',
})
export class MisReservasComponent implements OnInit {
  comentarios: any[] = [];
  nuevoComentario = { texto: '', calificacion: 0, hotelId: null };
  estrellas = [1, 2, 3, 4, 5];
  comentariosMostrados = 2;
  estaAutenticado: boolean = false;
  hotelesReservados: any[] = [];

  constructor(
    private authService: AuthService,
    private comentariosService: ComentariosService
  ) {}

  ngOnInit(): void {
    this.verificarUsuario();
  }

  verificarUsuario(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.estaAutenticado = false;
      console.log("Usuario no autenticado: no hay token");
      return;
    }

    this.authService.obtenerUsuarioLogueado(token).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.usuario) {
          this.estaAutenticado = true;
          console.log("Usuario autenticado:", response.usuario);
          this.cargarHotelesReservados();
        } else {
          this.estaAutenticado = false;
          console.log("Usuario no autenticado: respuesta inválida");
        }
      },
      error: (error) => {
        this.estaAutenticado = false;
        console.error('Error al verificar usuario:', error);
      }
    });
  }

  cargarHotelesReservados(): void {
    this.comentariosService.getReservaciones().subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.hotelesReservados = response.data.map((reserva: any) => ({
            id: reserva.hotel_id,
            nombre: reserva.hotel_nombre
          }));
          console.log("Hoteles Reservados", this.hotelesReservados);
        } else {
          console.warn('No se encontraron reservas o formato incorrecto.');
          this.hotelesReservados = [];
        }
      },
      error: (error) => {
        console.error('Error al obtener reservas:', error);
        this.hotelesReservados = [];
      }
    });
  }

  agregarComentario(): void {
    if (!this.nuevoComentario.texto || !this.nuevoComentario.calificacion || !this.nuevoComentario.hotelId) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.comentariosService.agregarComentario(
      this.nuevoComentario.hotelId,
      this.nuevoComentario.calificacion,
      this.nuevoComentario.texto
    ).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.nuevoComentario = { texto: '', calificacion: 0, hotelId: null };
        } else {
          console.error('Error al agregar comentario.');
        }
      },
      error: (error) => {
        console.error('Error al agregar comentario:', error);
      }
    });
  }

  seleccionarCalificacion(valor: number): void {
    this.nuevoComentario.calificacion = valor;
  }
}

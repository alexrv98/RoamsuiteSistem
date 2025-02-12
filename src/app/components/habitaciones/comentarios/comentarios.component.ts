import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';  // Importa el AuthService
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../../services/comentarios.service';  // Importa ComentariosService
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comentarios',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  comentarios: any[] = [];
  nuevoComentario = { nombre: '', texto: '', calificacion: 0 };
  estrellas = [1, 2, 3, 4, 5];
  comentariosMostrados = 2;
  nombreUsuario: string = '';  // Variable para almacenar el nombre del usuario
  estaAutenticado: boolean = false;
  @Input() hotelId: number | null = null;

  constructor(private authService: AuthService, private comentariosService: ComentariosService) {}

  ngOnInit(): void {
    this.cargarComentarios();
    this.setUsuarioLogueado();  // Establecer el nombre del usuario logueado
  }

  cargarComentarios(): void {
    if (this.hotelId !== null) {
      this.comentariosService.getComentarios(this.hotelId).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.comentarios = response.data;
          } else {
            console.error('Error al cargar los comentarios');
          }
        },
        error: (error) => {
          console.error('Error al cargar los comentarios:', error);
        }
      });
    }
  }

  setUsuarioLogueado(): void {
    const token = this.authService.getToken(); // Obtener el token almacenado
    if (token) {
      this.authService.obtenerUsuarioLogueado(token).subscribe({
        next: (response) => {
          if (response.status === 'success' && response.usuario) {
            this.nombreUsuario = response.usuario.nombre;  // Asignar el nombre del usuario logueado
            this.estaAutenticado = true;  // Confirmar que está autenticado
          } else {
            console.error('Usuario no encontrado');
            this.estaAutenticado = false;  // Marcar como no autenticado si no se encuentra el usuario
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos del usuario:', error);
          this.estaAutenticado = false;  // Marcar como no autenticado si hay error
        }
      });
    } else {
      this.estaAutenticado = false;  // Marcar como no autenticado si no hay token
    }
  }

  agregarComentario(): void {
    if (this.nuevoComentario.nombre && this.nuevoComentario.texto) {
      if (this.hotelId !== null) {
        this.comentariosService.agregarComentario(this.hotelId, this.nuevoComentario.calificacion, this.nuevoComentario.texto)
          .subscribe({
            next: (response) => {
              if (response.status === 'success') {
                this.cargarComentarios();
                this.nuevoComentario = { nombre: '', texto: '', calificacion: 0 };  // Limpiar formulario
              } else {
                console.error('Error al agregar comentario');
              }
            },
            error: (error) => {
              console.error('Error al agregar comentario:', error);
            }
          });
      }
    } else {
      alert('Por favor completa todos los campos.');
    }
  }

  seleccionarCalificacion(valor: number): void {
    this.nuevoComentario.calificacion = valor;
  }

  verMas(): void {
    this.comentariosMostrados += 2;
  }
}

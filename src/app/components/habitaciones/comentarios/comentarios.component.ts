import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../../services/comentarios.service';
import { Router } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-comentarios',
  imports: [FormsModule, CommonModule],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  comentarios: any[] = [];
  nuevoComentario = { texto: '', calificacion: 0, hotelId: null, usuarioId: null, nombreHotel: '' };
  estrellas = [1, 2, 3, 4, 5];
  comentariosMostrados = 2;
  estaAutenticado: boolean = false;
  hotelesReservados: any[] = [];

  usuarioNombre: string = '';

  constructor(
    private authService: AuthService,
    private comentariosService: ComentariosService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verificarUsuario();
    this.cargarDatosDesdeRuta();
    this.cargarHotelesReservados();  // Llamada para cargar los hoteles reservados
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
          this.nuevoComentario.usuarioId = response.usuario.id;
          this.usuarioNombre = response.usuario.nombre;
          console.log("Usuario autenticado:", response.usuario);

          // Llamar a cargarHotelesReservados() solo después de verificar la autenticación
          this.cargarHotelesReservados();
        } else {
          this.estaAutenticado = false;
        }
      },
      error: (error) => {
        this.estaAutenticado = false;
        console.error('Error al verificar usuario:', error);
      }
    });
  }


  cargarDatosDesdeRuta(): void {
    const queryParams = this.router.routerState.snapshot.root.queryParams;
    if (queryParams['hotelId'] && queryParams['nombreHotel']) {
      this.nuevoComentario.hotelId = queryParams['hotelId'];
      this.nuevoComentario.nombreHotel = queryParams['nombreHotel'];
      console.log("Datos cargados desde la ruta:", queryParams);
    } else {
      console.log("Parámetros de la ruta faltantes o incorrectos.");
    }
  }
  cargarHotelesReservados(): void {
    if (!this.estaAutenticado) {
      console.log("Usuario no autenticado. No se pueden cargar las reservas.");
      return;
    }

    this.comentariosService.getReservaciones().subscribe({
      next: (response) => {
        console.log("Respuesta de la API:", response);
        if (response && response.status === 'success' && response.data && Array.isArray(response.data)) {
          this.hotelesReservados = response.data.map((reserva: any) => ({
            id: reserva.hotel_id, // Asegurar que este es el ID correcto del hotel
            nombre: reserva.hotel_nombre
          }));
        } else {
          console.log("No se encontraron reservas o la respuesta es inválida.");
        }
      },
      error: (error) => {
        console.error("Error al cargar las reservas:", error);
      }
    });
  }



  agregarComentario(): void {
    if (!this.nuevoComentario.texto || !this.nuevoComentario.calificacion || !this.nuevoComentario.hotelId || !this.nuevoComentario.usuarioId) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.comentariosService.agregarComentario(
      this.nuevoComentario.hotelId,
      this.nuevoComentario.calificacion,
      this.nuevoComentario.texto,
      this.nuevoComentario.usuarioId
    ).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response); // Imprimir la respuesta
        if (response && response.status === 'success') {
          this.nuevoComentario = { texto: '', calificacion: 0, hotelId: null, usuarioId: this.nuevoComentario.usuarioId, nombreHotel: '' };
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

  onHotelChange(): void {
    const selectedHotel = this.hotelesReservados.find(hotel => hotel.id == this.nuevoComentario.hotelId);
    if (selectedHotel) {
      this.nuevoComentario.nombreHotel = selectedHotel.nombre;
    } else {
      console.error('Hotel no encontrado en la lista de reservas');
    }
  }


}

import { Component, OnInit, Input } from '@angular/core'; // Importa Input
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../../services/comentarios.service';
import { RouterLink } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';  // Importa correctamente el servicio de reservas

@Component({
  selector: 'app-comentarios',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  @Input() hotelId: number | null = null;  // Recibe el ID del hotel desde el padre

  comentarios: any[] = [];
  nuevoComentario: { texto: string; calificacion: number; hotelId: number | null } = {
    texto: '',
    calificacion: 0,
    hotelId: null
  };
    estrellas = [1, 2, 3, 4, 5];
  comentariosMostrados = 2;
  estaAutenticado: boolean = false;
  hotelesReservados: any[] = [];

  constructor(
    private authService: AuthService,
    private comentariosService: ComentariosService,
    private reservaService: ReservaService  // Usa el servicio correcto
  ) {}

  ngOnInit(): void {
    this.verificarUsuario();
    console.log("Estado de autenticación:", this.estaAutenticado); 
    console.log("Hotel recibido:", this.hotelId); 

    if (this.hotelId) {
      this.nuevoComentario.hotelId = this.hotelId;
    }
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
    this.reservaService.obtenerReservacionesUsuario().subscribe({
      next: (response) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          this.hotelesReservados = response.data.map((reserva: any) => ({
            id: reserva.hotel_id,
            nombre: reserva.nombre_hotel
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

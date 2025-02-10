import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HabitacionesService } from '../../services/habitacion.service';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from './../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalReservaComponent } from './modal-reserva/modal-reserva.component';
import { ComentariosComponent } from './comentarios/comentarios.component';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FiltroHotelesComponent,
    ModalReservaComponent,
    ComentariosComponent,
    RouterLink,
],
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
})
export class HabitacionesComponent implements OnInit {
  hotelId!: number;
  filtros: any = {};
  habitaciones: any = { mejorOpcion: [], otrasHabitaciones: [] };

  habitacionSeleccionada: any = null;

  seleccionarHabitacion(habitacion: any) {
    this.habitacionSeleccionada = habitacion;
  }

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesService
  ) {}

  ngOnInit() {
    this.hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));

    const state = history.state;
    if (state.filtros) {
      this.filtros = state.filtros;
    } else {
      console.warn('No hay filtros en el estado de navegación.');
    }

    this.obtenerHabitaciones();
  }

  obtenerHabitaciones() {
    const filtros = {
      hotelId: this.hotelId,
      fechaInicio: this.filtros.fechaInicio,
      fechaFin: this.filtros.fechaFin,
      huespedes: this.filtros.huespedes,
    };

    this.habitacionesService.obtenerHabitaciones(filtros).subscribe((res) => {
      if (res.status === 'success') {
        this.habitaciones = res.data;
      } else {
        console.error('Error al obtener habitaciones:', res.message);
      }
    });
  }

  // Botones para scroll horizontal
  scrollLeft() {
    document
      .getElementById('scrollContainer')!
      .scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    document
      .getElementById('scrollContainer')!
      .scrollBy({ left: 300, behavior: 'smooth' });
  }
}

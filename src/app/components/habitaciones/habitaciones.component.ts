import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from './../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalReservaComponent } from './modal-reserva/modal-reserva.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { FooterComponent } from '../footer/footer.component';
import { HabitacionesClienteService } from '../../services/habitacionesCliente.service';
import { ListComentariosComponent } from '../list-comentarios/list-comentarios.component';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FiltroHotelesComponent,
    ModalReservaComponent,
    ComentariosComponent,
    FooterComponent,
    FormsModule,
    ListComentariosComponent,
  ],
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
})
export class HabitacionesComponent implements OnInit, OnDestroy {
  hotelId!: number;
  hotelNombre: string = ''; // Agregamos una variable para el nombre del hotel
  filtros: any = {};
  habitaciones: any = { mejorOpcion: [], otrasHabitaciones: [] };
  mensajeBusqueda: string | null = null;
  isLoading: boolean = true;
  habitacionSeleccionada: any = null;
  habitacionesOriginales: any = { mejorOpcion: [], otrasHabitaciones: [] };
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesClienteService
  ) { }

  ngOnInit() {

    const state = history.state;
    if (state.hotelId) {
      this.hotelId = state.hotelId;
    }
    if (state.hotelNombre) {
      this.hotelNombre = state.hotelNombre; // Guardamos el nombre del hotel
    }
      if (state.filtros) {
      this.filtros = state.filtros;
      console.log('Filtros cargados desde el estado de navegación:', this.filtros);
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
      adultos: this.filtros.huespedesAdultos,
      ninos: this.filtros.huespedesNinos,
      camas: this.filtros.numCamas,
    };

    this.habitacionesService
      .obtenerHabitaciones(filtros)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        console.log('Respuesta de la API:', res);

        if (res.status === 'success') {
          this.mensajeBusqueda = res.mensaje_busqueda || null;

          this.habitaciones = {
            mejorOpcion: res.habitacionesExactas, // Habitaciones con el número exacto de camas
            otrasHabitaciones: res.otrasHabitaciones, // Habitaciones con diferente número de camas
          };

          console.log('Habitaciones exactas:', this.habitaciones.mejorOpcion);
          console.log('Otras habitaciones:', this.habitaciones.otrasHabitaciones);
        } else {
          console.error('Error al obtener habitaciones:', res.message);
          this.habitaciones = { mejorOpcion: [], otrasHabitaciones: [] };
        }

        this.isLoading = false;
      });
  }


  filtrarPorPrecio() {
    const min = this.filtroPrecioMin ?? 0;
    const max = this.filtroPrecioMax ?? Number.MAX_SAFE_INTEGER;

    this.habitaciones.mejorOpcion =
      this.habitacionesOriginales.mejorOpcion.filter(
        (habitacion: any) =>
          habitacion.precio >= min && habitacion.precio <= max
      );

    this.habitaciones.otrasHabitaciones =
      this.habitacionesOriginales.otrasHabitaciones.filter(
        (habitacion: any) =>
          habitacion.precio >= min && habitacion.precio <= max
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  seleccionarHabitacion(habitacion: any) {
    this.habitacionSeleccionada = habitacion;
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from './../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalReservaComponent } from './modal-reserva/modal-reserva.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { FooterComponent } from '../footer/footer.component';
import { HabitacionesClienteService } from '../../services/habitacionesCliente.service';

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
    FormsModule
  ],
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
})
export class HabitacionesComponent implements OnInit, OnDestroy {
  hotelId!: number;
  filtros: any = {};
  habitaciones: any = { mejorOpcion: [], otrasHabitaciones: [] };
  isLoading: boolean = true;

  habitacionSeleccionada: any = null;
  habitacionesOriginales: any = { mejorOpcion: [], otrasHabitaciones: [] };
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;


  private unsubscribe$ = new Subject<void>();


  seleccionarHabitacion(habitacion: any) {
    this.habitacionSeleccionada = habitacion;
  }

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesClienteService
  ) { }

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

    this.habitacionesService
      .obtenerHabitaciones(filtros)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res.status === 'success') {
          this.habitacionesOriginales = res.data;
          this.habitaciones = { ...res.data };
          this.filtrarPorPrecio();
        } else {
          console.error('Error al obtener habitaciones:', res.message);
        }
        this.isLoading = false;
      });


  }

  filtrarPorPrecio() {
    const min = this.filtroPrecioMin ?? 0;
    const max = this.filtroPrecioMax ?? Number.MAX_SAFE_INTEGER;

    this.habitaciones.mejorOpcion = this.habitacionesOriginales.mejorOpcion.filter(
      (habitacion: any) => habitacion.precio >= min && habitacion.precio <= max
    );

    this.habitaciones.otrasHabitaciones = this.habitacionesOriginales.otrasHabitaciones.filter(
      (habitacion: any) => habitacion.precio >= min && habitacion.precio <= max
    );
  }



  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

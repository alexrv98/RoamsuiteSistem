import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
    RouterLink,
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
  imagenesHabitaciones: { [key: number]: string[] } = {}; // Almacena imágenes por habitacion_id


  private unsubscribe$ = new Subject<void>();

  @ViewChild('otrasopciones') otrasOpcionesRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesClienteService
  ) {}

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
        if (res.status === 'success') {
          this.mensajeBusqueda = res.mensaje_busqueda || null;

          this.habitaciones = {
            mejorOpcion: res.habitacionesExactas,
            otrasHabitaciones: res.otrasHabitaciones,
          };

          // Obtener imágenes de cada habitación
          [...this.habitaciones.mejorOpcion, ...this.habitaciones.otrasHabitaciones].forEach(
            (habitacion: any) => {
              this.cargarImagenes(habitacion.habitacion_id);
            }
          );

          console.log(this.habitaciones);
        } else {
          console.error('Error al obtener habitaciones:', res.message);
          this.habitaciones = { mejorOpcion: [], otrasHabitaciones: [] };
        }

        this.isLoading = false;
      });
  }


  cargarImagenes(habitacionId: number) {
    this.habitacionesService.getImagenesHabitacion(habitacionId).subscribe(
      (res: any) => {
        console.log(`Imágenes de la habitación ${habitacionId}:`, res); // 👈 Verifica respuesta

        if (res.status === 'success' && res.data.length > 0) {
          this.imagenesHabitaciones[habitacionId] = res.data.map((img: any) => img.img_url);
        } else {
          console.warn(`No se encontraron imágenes para la habitación ${habitacionId}`);
        }
      },
      (err) => {
        console.error('Error al obtener imágenes:', err);
      }
    );
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

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'otrasopciones') {
        this.scrollToSection();
      }
    });
  }

  scrollToSection() {
    if (this.otrasOpcionesRef) {
      setTimeout(() => {
        this.otrasOpcionesRef.nativeElement.scrollIntoView({
          behavior: 'smooth',
        });
      }, 300);
    }
  }
}

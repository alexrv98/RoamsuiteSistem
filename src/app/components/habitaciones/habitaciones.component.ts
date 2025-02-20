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
  hotelNombre: string = ''; 
  filtros: any = {};
  habitaciones: any = { mejorOpcion: [], otrasHabitaciones: [] };
  mensajeBusqueda: string | null = null;
  isLoading: boolean = true;
  habitacionSeleccionada: any = null;
  habitacionesOriginales: any = { mejorOpcion: [], otrasHabitaciones: [] };
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;
  imagenesHabitaciones: { [key: number]: string[] } = {}; // Almacena imágenes por habitacion_id

  filtrosOriginales: any = {}; // Aquí guardamos los filtros originales (no modificados)

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
      this.hotelNombre = state.hotelNombre;
    }

    // Solo cargamos los filtros iniciales si no están en el state (es decir, es la primera vez que entramos)
    if (state.filtros) {
      this.filtrosOriginales = state.filtros; // Guardamos los filtros originales
      this.filtros = { ...state.filtros };  // Los filtros actuales para modificación
    } else {
      // Si no existen filtros en el state, asignamos unos valores por defecto
      this.filtrosOriginales = {
        fechaInicio: 'fecha_default',
        fechaFin: 'fecha_default',
        huespedesAdultos: 1,
        huespedesNinos: 0,
        numCamas: 1
      };
      this.filtros = { ...this.filtrosOriginales };
    }

    this.obtenerHabitaciones();
  }

  obtenerHabitaciones() {
    const filtros = {
      hotelId: this.hotelId,
      fechaInicio: this.filtrosOriginales.fechaInicio,  // Usamos los filtros originales
      fechaFin: this.filtrosOriginales.fechaFin,        // Usamos los filtros originales
      adultos: this.filtrosOriginales.huespedesAdultos,
      ninos: this.filtrosOriginales.huespedesNinos,
      camas: this.filtrosOriginales.numCamas,
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
        console.log(`Imágenes de la habitación ${habitacionId}:`, res);

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



  seleccionarHabitacion(habitacion: any) {
    this.habitacionSeleccionada = habitacion;
  }

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


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

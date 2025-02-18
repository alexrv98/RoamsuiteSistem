import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HotelService } from '../../services/hoteles.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-lista-hoteles',
  templateUrl: './lista-hoteles.component.html',
  imports: [
    CommonModule,
    FiltroHotelesComponent,
    NavbarComponent,
    FooterComponent,
  ],
  styleUrls: ['./lista-hoteles.component.css'],
})
export class ListaHotelesComponent implements OnInit, OnDestroy {
  hoteles: any[] = [];
  filtros: any = {};
  isLoading: boolean = true;

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private hotelService: HotelService) {}

  ngOnInit() {
    const state = history.state;
    if (state.filtros) {
      this.filtros = state.filtros;
      this.cargarHoteles();
    } else {
      console.warn('No hay filtros en el estado de navegación.');
    }
  }

  cargarHoteles() {
    this.hotelService
      .obtenerHotelesDisponibles(this.filtros)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res.status === 'success') {
          this.hoteles = res.data;
        } else {
          console.error('Error en la API:', res.message);
        }
        this.isLoading = false;
      });
  }

  verHabitaciones(hotelId: number, hotelNombre: string) {
    this.router.navigate(['/habitaciones'], {
      state: { hotelId: hotelId, hotelNombre: hotelNombre, filtros: this.filtros },
    });
  }



  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}

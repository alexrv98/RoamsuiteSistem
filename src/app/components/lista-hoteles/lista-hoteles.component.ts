import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

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
export class ListaHotelesComponent implements OnInit {
  hoteles: any[] = [];
  filtros: any = {};

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

  actualizarFiltros(nuevosFiltros: any) {
    this.filtros = { ...nuevosFiltros };
  }

  cargarHoteles() {
    this.hotelService
      .obtenerHotelesDisponibles(this.filtros)
      .subscribe((res) => {
        if (res.status === 'success') {
          this.hoteles = res.data;
        } else {
          console.error('Error en la API:', res.message);
        }
      });
  }

  verHabitaciones(hotelId: number) {
    this.router.navigate(['/habitaciones', hotelId], {
      state: { filtros: this.filtros }, // 🔥 Pasamos los filtros de forma oculta
    });
  }

  // Función para convertir el número de estrellas en un array de estrellas para mostrar en el HTML
  getStarArray(promedio: number): number[] {
    return Array(Math.round(promedio)).fill(1);
  }
}

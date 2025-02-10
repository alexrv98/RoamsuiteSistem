import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-lista-hoteles',
  templateUrl: './lista-hoteles.component.html',
  imports: [CommonModule, FiltroHotelesComponent, NavbarComponent, RouterLink],
  styleUrls: ['./lista-hoteles.component.css'],
})
export class ListaHotelesComponent implements OnInit {
  hoteles: any[] = [];
  filtros: any = {}; 

  constructor(
    private router: Router,
    private hotelService: HotelService
  ) {}

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
    this.hotelService.obtenerHotelesDisponibles(this.filtros).subscribe((res) => {
      if (res.status === 'success') {
        this.hoteles = res.data;
      } else {
        console.error('Error en la API:', res.message);
      }
    });
  }
  

  verHabitaciones(hotelId: number) {
    this.router.navigate(['/habitaciones', hotelId], {
      state: { filtros: this.filtros }, 
    });
  }
  
}

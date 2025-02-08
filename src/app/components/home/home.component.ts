import { Component } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { ListaHotelesComponent } from '../lista-hoteles/lista-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LugaresHomeComponent } from './lugares-home/lugares-home.component';
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from '../habitaciones/comentarios/comentarios.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-home',
  imports: [
    FooterComponent,
    FiltroHotelesComponent,
    ListaHotelesComponent,
    NavbarComponent,
    LugaresHomeComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  hoteles: any[] = [];
  filtros: any = {
    destino: null,
    fechaInicio: null,
    fechaFin: null,
    huespedes: 1,
  };

  constructor(private hotelService: HotelService) {}

  onFiltrosAplicados(filtros: any) {
    this.filtros = { ...filtros };
    this.hoteles = [];
    this.hotelService.obtenerHotelesDisponibles(filtros).subscribe((res) => {
      if (res.status === 'success') {
        this.hoteles = res.data;
      } else {
        console.error('Error al obtener los hoteles:', res.message);
      }
    });
  }
}

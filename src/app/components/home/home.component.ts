import { Component } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { ListaHotelesComponent } from '../lista-hoteles/lista-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [FiltroHotelesComponent, ListaHotelesComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  hoteles: any[] = [];

  constructor(private hotelService: HotelService) {}

  onFiltrosAplicados(filtros: any) {
    this.hotelService.obtenerHotelesDisponibles(filtros).subscribe((res) => {
      if (res.status === 'success') {
        this.hoteles = res.data;
      }
    });
  }
}

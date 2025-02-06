import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-lista-hoteles',
  templateUrl: './lista-hoteles.component.html',
  imports: [CommonModule, FiltroHotelesComponent, NavbarComponent],
  styleUrls: ['./lista-hoteles.component.css'],
})
export class ListaHotelesComponent implements OnInit {
  hoteles: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const filtros = {
        destino: params['destino'],
        fechaInicio: params['fechaInicio'],
        fechaFin: params['fechaFin'],
        huespedes: params['huespedes'],
      };

      this.hotelService
        .obtenerHotelesDisponibles(filtros)
        .subscribe((response) => {
          this.hoteles = response.data;
        });
    });
  }
  // Función para convertir el número de estrellas en un array de estrellas para mostrar en el HTML
  getStarArray(promedio: number): number[] {
    return Array(Math.round(promedio)).fill(1);
  }
}

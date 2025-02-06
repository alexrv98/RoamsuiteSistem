import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-lista-hoteles',
  templateUrl: './lista-hoteles.component.html',
  imports: [CommonModule, FiltroHotelesComponent, NavbarComponent],
  styleUrls: ['./lista-hoteles.component.css'],
})
export class ListaHotelesComponent implements OnInit {
  @Input() hoteles: any[] = [];
  @Input() filtros: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    if (!this.filtros || !this.filtros.destino) {
      this.route.params.subscribe((params) => {
        this.filtros = {
          destino: params['destino'],
          fechaInicio: params['fechaInicio'],
          fechaFin: params['fechaFin'],
          huespedes: params['huespedes'],
        };

        this.hotelService
          .obtenerHotelesDisponibles(this.filtros)
          .subscribe((res) => {
            if (res.status === 'success') {
              this.hoteles = res.data;
            } else {
              console.error('Error en la API:', res.message);
            }
          });
      });
    }
  }


  verHabitaciones(hotelId: number) {
    this.router.navigate(['/habitaciones', hotelId], {
      queryParams: {
        destino: this.filtros.destino, 
        fechaInicio: this.filtros.fechaInicio,
        fechaFin: this.filtros.fechaFin,
        huespedes: this.filtros.huespedes,
      },
    });
  }
  
  
  // Función para convertir el número de estrellas en un array de estrellas para mostrar en el HTML
  getStarArray(promedio: number): number[] {
    return Array(Math.round(promedio)).fill(1);
  }
}

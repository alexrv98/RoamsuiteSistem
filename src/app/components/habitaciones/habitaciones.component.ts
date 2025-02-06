import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HabitacionesService } from '../../services/habitacion.service';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from './../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FiltroHotelesComponent],
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css'],
})
export class HabitacionesComponent implements OnInit {
  hotelId!: number;
  filtros: any = {
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
  };
  habitaciones: any = { mejorOpcion: [], otrasHabitaciones: [] };

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId']; // El ID del hotel
    });
  
    this.route.queryParams.subscribe((queryParams) => {
      // Actualizamos los filtros según los queryParams de la URL
      this.filtros = {
        destino: queryParams['destino'] || '', // Filtro de destino
        fechaInicio: queryParams['fechaInicio'] || '', // Filtro de fecha de inicio
        fechaFin: queryParams['fechaFin'] || '', // Filtro de fecha de fin
        huespedes: +queryParams['huespedes'] || 1, // Filtro de huéspedes
      };
      
      // Ahora que los filtros están actualizados, obtenemos las habitaciones
      this.obtenerHabitaciones();
    });
  }
  
  

  obtenerHabitaciones() {
    const filtros = {
      hotelId: this.hotelId,
      fechaInicio: this.filtros.fechaInicio,
      fechaFin: this.filtros.fechaFin,
      huespedes: this.filtros.huespedes,
    };

    this.habitacionesService.obtenerHabitaciones(filtros).subscribe((res) => {
      if (res.status === 'success') {
        this.habitaciones = res.data;
      } else {
        console.error('Error al obtener habitaciones:', res.message);
      }
    });
  }
}

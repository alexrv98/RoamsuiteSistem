import { FiltroHotelesComponent } from './../filtro-hoteles/filtro-hoteles.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HabitacionesService } from '../../services/habitacion.service';
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
  fechaInicio!: string;
  fechaFin!: string;
  huespedes!: number;
  habitaciones: any = { mejorOpcion: [], otrasHabitaciones: [] };

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId'];
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.fechaInicio = queryParams['fechaInicio'];
      this.fechaFin = queryParams['fechaFin'];
      this.huespedes = +queryParams['huespedes'];

      this.obtenerHabitaciones();
    });
  }

  obtenerHabitaciones() {
    const filtros = {
      hotelId: this.hotelId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      huespedes: this.huespedes,
    };

    this.habitacionesService.obtenerHabitaciones(filtros).subscribe((res) => {
      if (res.status === 'success') {
        this.habitaciones = res.data;
      } else {
        console.error('Error al obtener habitaciones:', res.message);
      }
    });
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
}

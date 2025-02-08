import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HabitacionesService } from '../../services/habitacion.service';
import { CommonModule } from '@angular/common';
import { FiltroHotelesComponent } from './../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalReservaComponent } from './modal-reserva/modal-reserva.component';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FiltroHotelesComponent,
    ModalReservaComponent,
  ],
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


  habitacionSeleccionada: any = null;

  seleccionarHabitacion(habitacion: any) {
    this.habitacionSeleccionada = habitacion;
  }
  
  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.hotelId = +params['hotelId']; 
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.filtros = {
        destino: queryParams['destino'] || '',
        fechaInicio: queryParams['fechaInicio'] || '', 
        fechaFin: queryParams['fechaFin'] || '', 
        huespedes: +queryParams['huespedes'] || 1, 
      };
      
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

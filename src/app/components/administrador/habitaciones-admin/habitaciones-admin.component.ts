import { Component, Input, OnInit } from '@angular/core';
import { HabitacionService } from '../../../services/habitaciones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-habitaciones-admin',
  templateUrl: './habitaciones-admin.component.html',
  imports:[CommonModule],
  styleUrl: './habitaciones-admin.component.css',
})
export class HabitacionesAdminComponent implements OnInit {
  @Input() hotelId!: number;
  habitaciones: any[] = [];

  constructor(private habitacionService: HabitacionService) {}

  ngOnInit(): void {
    if (this.hotelId) {
      this.cargarHabitaciones();
    }
  }

  cargarHabitaciones(): void {
    this.habitacionService.obtenerHabitaciones(this.hotelId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.habitaciones = response.data;
        } else {
          console.error('Error al obtener habitaciones:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar habitaciones:', error);
      },
      complete: () => {
        console.log('Carga de habitaciones completada');
      }
    });
  }
  
}

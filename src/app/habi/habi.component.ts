import { Component, OnInit } from '@angular/core';
import { HabitacionesClienteService } from '../services/habitacionesCliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-habi',
  imports: [CommonModule, FormsModule],
  templateUrl: './habi.component.html',
  styleUrl: './habi.component.css'
})
export class HabiComponent implements OnInit {
  imagenes: any[] = [];
  habitaciones: any[] = []; // Aquí guardaremos todas las habitaciones y sus imágenes.

  constructor(private habitacionesService: HabitacionesClienteService) {}

  ngOnInit() {
    this.obtenerImagenesDeHabitaciones(); // Llamar al método para obtener imágenes de múltiples habitaciones.
  }

  obtenerImagenesDeHabitaciones() {
    // Suponiendo que tienes un arreglo de habitacionIds que deseas consultar
  //   const habitacionIds = [1, 2, 3];  // Aquí puedes colocar los IDs de las habitaciones que quieras consultar
  //   habitacionIds.forEach(id => {
  //     this.habitacionesService.obtenerImagenesPorHabitacion(id).subscribe(
  //       (response) => {
  //         if (response.status === 'success') {
  //           // Agregar las imágenes de cada habitación a la lista de habitaciones
  //           this.habitaciones.push({
  //             habitacionId: id,
  //             imagenes: response.data
  //           });
  //         } else {
  //           console.error(response.message);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error al obtener las imágenes', error);
  //       }
  //     );
  //   });
  // }
}}

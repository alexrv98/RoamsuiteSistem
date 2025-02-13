import { Component, Input, OnInit } from '@angular/core';
import { HabitacionesAdminService } from '../../../services/habitacionesAdmin.service';
import { CommonModule } from '@angular/common';
import { ModalAgregarHabitacionComponent } from './modal-agregar-habitacion/modal-agregar-habitacion.component';
import { ModalEditarHabitacionComponent } from './modal-editar-habitacion/modal-editar-habitacion.component';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-habitaciones-admin',
  templateUrl: './habitaciones-admin.component.html',
  imports: [
    CommonModule,
    ModalAgregarHabitacionComponent,
    ModalEditarHabitacionComponent,
    DataTablesModule,
  ],
  styleUrl: './habitaciones-admin.component.css',
})
export class HabitacionesAdminComponent implements OnInit {
  @Input() hotelId!: number;
  habitaciones: any[] = [];
  mostrarModal = false;
  mostrarModalEditar = false;
  habitacionSeleccionada: any = null;

  dtOptions: any = {};
  // ✅ Agregado para evitar errores

  constructor(private habitacionService: HabitacionesAdminService) {}

  ngOnInit(): void {
    // ✅ Configuración de DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      paging: true,
      dom: 'Pfrtip',
      select: {
        style: 'multi', // o 'single' si solo quieres seleccionar uno a la vez
        selector: 'td:first-child', // Asegurar que el selector funciona bien
      },

      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
      },
    };

    if (this.hotelId) {
      this.cargarHabitaciones();
    }
  }

  cargarHabitaciones(): void {
    this.habitacionService.obtenerHabitaciones(this.hotelId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.habitaciones = response.data;
        }
      },
      error: (error) => console.error('Error al cargar habitaciones:', error),
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  abrirModalEditar(habitacion: any): void {
    this.habitacionSeleccionada = habitacion;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
  }
}

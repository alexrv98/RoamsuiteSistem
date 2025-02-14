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
  isLoading: boolean = true; // Indicador de carga

  dtOptions: any = {};

  constructor(private habitacionService: HabitacionesAdminService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      paging: true,
      dom: 'Pfrtip',
      select: {
        style: 'multi',
        selector: 'td:first-child',
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
        this.isLoading = false;
      },
      error: (error) => console.error('Error al cargar habitaciones:', error),
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    window.location.reload();
  }

  abrirModalEditar(habitacion: any): void {
    this.habitacionSeleccionada = habitacion;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    window.location.reload();
  }

  eliminarHabitacion(idHabitacion: number): void {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar esta habitación? Esta acción no se puede deshacer.'
      )
    ) {
      this.habitacionService.eliminarHabitacion(idHabitacion).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            alert('Habitación eliminada correctamente.');
            window.location.reload(); // 🔄 Recargar la página
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error('Error al eliminar la habitación:', error);
          alert('No se pudo eliminar la habitación.');
        },
      });
    }
  }
}

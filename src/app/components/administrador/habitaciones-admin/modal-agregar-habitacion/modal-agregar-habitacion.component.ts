import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HabitacionesAdminService } from '../../../../services/habitacionesAdmin.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-agregar-habitacion',
  standalone: true,
  templateUrl: './modal-agregar-habitacion.component.html',
  styleUrls: ['./modal-agregar-habitacion.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ModalAgregarHabitacionComponent implements OnInit, OnDestroy {
  @Input() hotelId!: number;
  @Output() habitacionAgregada = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  habitacionForm!: FormGroup;
  tiposHabitacion: any[] = [];
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  imagenesSeleccionadas: { file: File, url: string }[] = []; // Guardamos archivo + URL de vista previa
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionesAdminService,
    private cdr: ChangeDetectorRef  // Inyectamos ChangeDetectorRef para forzar la detección de cambios
  ) {}

  ngOnInit(): void {
    this.habitacionForm = this.fb.group({
      numero_habitacion: ['', Validators.required],
      tipo_habitacion_id: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(1)]]
    });

    this.cargarTiposHabitacion();
  }

  cargarTiposHabitacion(): void {
    this.habitacionService.obtenerTiposHabitacion()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.tiposHabitacion = response.data;
          }
        },
        error: () => this.mostrarMensaje('Error al obtener tipos de habitación.', 'error')
      });
  }

  // Manejar la selección de imágenes una por una
  onImageSelect(event: any): void {
    const archivo = event.target.files[0];  // Obtener solo un archivo
    if (archivo) {
      const reader = new FileReader();

      reader.onload = () => {
        setTimeout(() => {
          if (typeof reader.result === 'string') {
            this.imagenesSeleccionadas.push({ file: archivo, url: reader.result });
            this.cdr.detectChanges(); // Forzar la detección de cambios
          }
        });
      };

      reader.readAsDataURL(archivo);  // Leer la imagen seleccionada
    }
  }

  agregarHabitacion(): void {
    if (this.habitacionForm.invalid || this.imagenesSeleccionadas.length === 0) {
      this.mostrarMensaje('Por favor, complete todos los campos correctamente y seleccione al menos una imagen.', 'error');
      return;
    }

    const nuevaHabitacion = {
      hotel_id: this.hotelId,
      ...this.habitacionForm.value
    };

    // Crear FormData para enviar la habitación y las imágenes
    const formData = new FormData();
    formData.append('hotel_id', nuevaHabitacion.hotel_id.toString());
    formData.append('numero_habitacion', nuevaHabitacion.numero_habitacion);
    formData.append('tipo_habitacion_id', nuevaHabitacion.tipo_habitacion_id);
    formData.append('precio', nuevaHabitacion.precio.toString());

    // Agregar las imágenes seleccionadas al FormData
    this.imagenesSeleccionadas.forEach((imagen) => {
      formData.append('imagenes[]', imagen.file, imagen.file.name);
    });

    this.habitacionService.agregarHabitacion(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.mostrarMensaje(response.message, 'success');
            setTimeout(() => {
              this.habitacionAgregada.emit();
              this.cerrarModal.emit();
            }, 1500);
          } else {
            this.mostrarMensaje(response.message, 'error');
          }
        },
        error: () => this.mostrarMensaje('Error al agregar habitación.', 'error')
      });
  }

  getImagePreview(imagenUrl: string): string {
    return imagenUrl;
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

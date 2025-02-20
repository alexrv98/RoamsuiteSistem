import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HabitacionesAdminService } from '../../../../services/habitacionesAdmin.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-agregar-habitacion',
  standalone: true,
  templateUrl: './modal-agregar-habitacion.component.html',
  styleUrls: ['./modal-agregar-habitacion.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ModalAgregarHabitacionComponent implements OnInit, OnDestroy {
  @Input() hotelId!: number;
  @Output() habitacionAgregada = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  habitacionForm!: FormGroup;
  tiposHabitacion: any[] = [];
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionesAdminService
  ) {}

  ngOnInit(): void {
    this.habitacionForm = this.fb.group({
      numero_habitacion: ['', Validators.required],
      tipo_habitacion_id: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(1)]],
      imagenes: this.fb.array([this.crearImagen()])  // Iniciar con un campo de imagen vacío
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

  crearImagen(): FormGroup {
    return this.fb.group({
      img_url: ['', Validators.required]  // Cada URL es obligatoria
    });
  }

  agregarImagen(): void {
    (this.habitacionForm.get('imagenes') as FormArray).push(this.crearImagen());  // Agregar un nuevo campo de URL
  }

  eliminarImagen(index: number): void {
    (this.habitacionForm.get('imagenes') as FormArray).removeAt(index);  // Eliminar un campo de URL específico
  }

  get imagenes() {
    return this.habitacionForm.get('imagenes') as FormArray;
  }

  agregarHabitacion(): void {
    if (this.habitacionForm.invalid) {
      this.mostrarMensaje('Por favor, complete todos los campos correctamente.', 'error');
      return;
    }


    const nuevaHabitacion = {
      hotel_id: this.hotelId,
      ...this.habitacionForm.value
    };

    this.habitacionService.agregarHabitacion(nuevaHabitacion)
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

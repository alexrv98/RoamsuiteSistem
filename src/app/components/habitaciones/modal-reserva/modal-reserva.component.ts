import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LugarService } from '../../../services/lugar.service';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-reserva',
  templateUrl: './modal-reserva.component.html',
  imports: [CommonModule],
  styleUrls: ['./modal-reserva.component.css'],
})
export class ModalReservaComponent implements OnChanges {
  @Input() habitacion: any = null;
  @Input() filtros: any = null;
  precioTotal: number = 0;

  constructor(private router: Router, private lugarService: LugarService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['habitacion'] || changes['filtros']) {
      this.precioTotal = this.calcularPrecioTotal();
    }
  }

  calcularPrecioTotal(): number {
    if (
      this.habitacion &&
      this.filtros?.fechaInicio &&
      this.filtros?.fechaFin
    ) {
      const fechaInicio = new Date(this.filtros.fechaInicio);
      const fechaFin = new Date(this.filtros.fechaFin);
      const noches = Math.max(
        1,
        Math.floor(
          (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      return noches * this.habitacion.precio;
    }
    return 0;
  }
  continuarReserva() {
    const reserva = {
      tipo_habitacion: this.habitacion?.tipo_habitacion,
      capacidad: this.habitacion?.capacidad,
      fechaInicio: this.filtros?.fechaInicio,
      fechaFin: this.filtros?.fechaFin,
      totalReserva: this.calcularPrecioTotal(),
      habitacion_id: this.habitacion?.numero_habitacion,

      adultosExtras: this.habitacion?.adultosExtras,
      destino_id: this.filtros?.destino,
      destino: '',
    };
  
    this.lugarService.obtenerDestinoPorId(this.filtros?.destino)
      .pipe(take(1)) 
      .subscribe((response) => {
        console.log('Respuesta de obtenerDestinoPorId:', response);  // Aquí se imprime la respuesta
  
        if (response.status === 'success') {
          reserva.destino = response.nombre;
  
          const usuarioAutenticado = this.authService.estaAutenticado();
          const ruta = usuarioAutenticado ? '/confirmar-reserva' : '/login';
          
          this.router.navigate([ruta], { state: { reserva }, replaceUrl: usuarioAutenticado });
        } else {
          alert('Error al obtener el destino');
        }
      });
  }
  
  
}

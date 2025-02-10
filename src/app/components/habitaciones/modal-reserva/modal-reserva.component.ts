import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LugarService } from '../../../services/lugar.service';


@Component({
  selector: 'app-modal-reserva',
  templateUrl: './modal-reserva.component.html',
  imports: [],
  styleUrls: ['./modal-reserva.component.css'],
})
export class ModalReservaComponent implements OnChanges {
  @Input() habitacion: any = null;
  @Input() filtros: any = null;
  precioTotal: number = 0;

  constructor(private router: Router, private lugarService: LugarService) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Cambios detectados en el modal:', changes);
    if (changes['habitacion'] || changes['filtros']) {
      this.precioTotal = this.calcularPrecioTotal();
    }
  }

  calcularPrecioTotal(): number {
    if (this.habitacion && this.filtros?.fechaInicio && this.filtros?.fechaFin) {
      const fechaInicio = new Date(this.filtros.fechaInicio);
      const fechaFin = new Date(this.filtros.fechaFin);
      const noches = Math.max(1, Math.floor((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)));
      return noches * this.habitacion.precio;
    }
    return 0;
  }

  continuarReserva() {

    const reserva = {
      tipo_habitacion: this.habitacion.tipo_habitacion,
      capacidad: this.habitacion.capacidad,
      fechaInicio: this.filtros.fechaInicio,
      fechaFin: this.filtros.fechaFin,
      totalReserva: this.calcularPrecioTotal(),
      habitacion_id: this.habitacion.numero_habitacion,
      destino_id: this.filtros.destino,
      destino: ""
    };

    this.lugarService.obtenerDestinoPorId(this.filtros.destino).subscribe((response) => {
      if (response.status === 'success') {
        reserva.destino = response.nombre;
        this.router.navigate(['/confirmar-reserva'], { state: { reserva }, replaceUrl: true });
      } else {
        alert('Error al obtener el destino');
      }
    });
  }

}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal-reserva',
  templateUrl: './modal-reserva.component.html',
  styleUrls: ['./modal-reserva.component.css'],
})
export class ModalReservaComponent implements OnChanges {
  @Input() habitacion: any = null;
  @Input() filtros: any = null;
  precioTotal: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    console.log("Cambios detectados en el modal:", changes);
    if (changes['habitacion'] || changes['filtros']) {
      this.calcularPrecioTotal();
    }
  }

  calcularPrecioTotal() {
    if (this.habitacion && this.filtros?.fechaInicio && this.filtros?.fechaFin) {
      const fechaInicio = new Date(this.filtros.fechaInicio);
      const fechaFin = new Date(this.filtros.fechaFin);
      const noches = Math.floor(
        (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      );
      this.precioTotal = noches * this.habitacion.precio;
    }
  }
}

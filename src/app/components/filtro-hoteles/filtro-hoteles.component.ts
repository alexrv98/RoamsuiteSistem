import { Component, EventEmitter, Output } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { compileNgModule } from '@angular/compiler';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtro-hoteles',
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-hoteles.component.html',
  styleUrls: ['./filtro-hoteles.component.css'],
})
export class FiltroHotelesComponent {
  destino: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  huespedes: number = 1;
  lugares: any[] = [];

  @Output() filtrosAplicados = new EventEmitter<any>();

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.hotelService.obtenerDestinos().subscribe((res) => {
      if (res.status === 'success') {
        this.lugares = res.data;
      }
    });
  }

  aplicarFiltros() {
    const filtros = {
      destino: this.destino,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      huespedes: this.huespedes,
    };
    this.filtrosAplicados.emit(filtros);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-filtro-hoteles',
  templateUrl: './filtro-hoteles.component.html',
  styleUrls: ['./filtro-hoteles.component.css'],
})
export class FiltroHotelesComponent {
  destino: string = ''; 
  fechaInicio: string = '';
  fechaFin: string = '';
  huespedes: number = 1;
  lugares: any[] = []; 

  constructor(private hotelService: HotelService, private router: Router) {}

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
      huespedes: this.huespedes
    };
    this.filtrosAplicados.emit(filtros);
  }
}

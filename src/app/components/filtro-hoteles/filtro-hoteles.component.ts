import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-filtro-hoteles',
  templateUrl: './filtro-hoteles.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./filtro-hoteles.component.css']
})
export class FiltroHotelesComponent implements OnInit {
  destinos: any[] = [];
  filtros = {
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
  };

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit() {
    this.cargarDestinos();
  }

  cargarDestinos() {
    this.hotelService.obtenerDestinos().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.destinos = response.data;
        } else {
          console.error('Error al obtener destinos:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la API:', error);
      },
    });
  }

  buscarHoteles() {
    const { destino, fechaInicio, fechaFin, huespedes } = this.filtros;
    if (!destino || !fechaInicio || !fechaFin || huespedes < 1) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    
    this.router.navigate(['/buscar', destino, fechaInicio, fechaFin, huespedes]);
  }
}

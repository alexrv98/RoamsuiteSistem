import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-filtro-hoteles',
  templateUrl: './filtro-hoteles.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./filtro-hoteles.component.css']
})
export class FiltroHotelesComponent implements OnInit {
  
  destinos: any[] = [];
  @Input() filtros: any = { 
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1
  };
  

  constructor(private hotelService: HotelService, private router: Router, private route: ActivatedRoute) {}

  
  ngOnInit() {
    this.cargarDestinos();
    
    if (!this.filtros.destino || !this.filtros.fechaInicio || !this.filtros.fechaFin || this.filtros.huespedes < 1) {
      this.route.params.subscribe((params) => {
        this.filtros = {
          destino: params['destino'] || '',
          fechaInicio: params['fechaInicio'] || '',
          fechaFin: params['fechaFin'] || '',
          huespedes: params['huespedes'] || 1,
        };
      });
    }
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

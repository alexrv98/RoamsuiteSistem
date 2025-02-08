import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { LugarService } from '../../services/lugar.service';
import { FiltroService } from '../../services/filtro.service';

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

  constructor(private lugarService: LugarService, private router: Router, private filtroService: FiltroService) {}

  ngOnInit() {
    this.cargarDestinos();
  }

  cargarDestinos() {
    this.lugarService.obtenerLugares().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.destinos = response.data;
        } else {
          console.error('Error al obtener destinos:', response.message);
        }
      },
      error: (error) => console.error('Error en la API:', error)
    });
  }

  buscarHoteles() {
  
    const { destino, fechaInicio, fechaFin, huespedes } = this.filtros;
    if (!destino || !fechaInicio || !fechaFin || huespedes < 1) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.router.navigate(['/buscar'], { state: { filtros: this.filtros } });

  }
  
   

  }

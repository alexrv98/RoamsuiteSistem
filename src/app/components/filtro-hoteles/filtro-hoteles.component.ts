import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LugarService } from '../../services/lugar.service';

@Component({
  selector: 'app-filtro-hoteles',
  templateUrl: './filtro-hoteles.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./filtro-hoteles.component.css'],
})
export class FiltroHotelesComponent implements OnInit {
  destinos: any[] = [];
  fechaMinima: string = '';
  fechaMaxima: string = '';
  @Input() filtros: any = {
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
  };

  constructor(
    private LugarService: LugarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarDestinos();
    this.establecerFechasMinMax();

    if (
      !this.filtros.destino ||
      !this.filtros.fechaInicio ||
      !this.filtros.fechaFin ||
      this.filtros.huespedes < 1
    ) {
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

  establecerFechasMinMax() {
    const hoy = new Date();
    const maxFecha = new Date();
    maxFecha.setFullYear(hoy.getFullYear() + 1);

    this.fechaMinima = hoy.toISOString().split('T')[0];
    this.fechaMaxima = maxFecha.toISOString().split('T')[0];
  }

  validarFechas() {
    const fechaInicio = new Date(this.filtros.fechaInicio);
    const fechaFin = new Date(this.filtros.fechaFin);
    const hoy = new Date();
    const maxFecha = new Date();
    maxFecha.setFullYear(hoy.getFullYear() + 1);

    if (fechaInicio < hoy) {
      alert('La fecha de inicio no puede ser anterior a hoy.');
      this.filtros.fechaInicio = this.fechaMinima;
    }

    if (fechaFin < fechaInicio) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
      this.filtros.fechaFin = this.filtros.fechaInicio;
    }

    if (fechaFin > maxFecha) {
      alert('El rango máximo permitido es de 1 año.');
      this.filtros.fechaFin = this.fechaMaxima;
    }
  }

  buscarHoteles() {
    this.validarFechas();

    const { destino, fechaInicio, fechaFin, huespedes } = this.filtros;
    if (!destino || !fechaInicio || !fechaFin || huespedes < 1) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.router.navigate([
      '/buscar',
      destino,
      fechaInicio,
      fechaFin,
      huespedes,
    ]);
  }

  cargarDestinos() {
    this.LugarService.obtenerLugares().subscribe({
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
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LugarService } from '../../services/lugar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


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

  private unsubscribe$ = new Subject<void>();

  constructor(private lugarService: LugarService, private router: Router) {}

  ngOnInit() {
    this.cargarDestinos();
    this.establecerFechasMinMax();
  }

  cargarDestinos() {
    this.lugarService.obtenerLugares().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.destinos = response.data;
        } else {
          console.error('Error al obtener destinos:', response.message);
        }
      },
      error: (error) => console.error('Error en la API:', error),
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  buscarHoteles() {
    const { destino, fechaInicio, fechaFin, huespedes } = this.filtros;
    
    if (!destino || !fechaInicio || !fechaFin || huespedes < 1) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    if (!this.validarFechas()) {
      return;
    }

    this.router.navigate(['/buscar'], { state: { filtros: this.filtros } });
  }

  establecerFechasMinMax() {
    const hoy = new Date();
    const maxFecha = new Date();
    maxFecha.setFullYear(hoy.getFullYear() + 1);

    this.fechaMinima = hoy.toISOString().split('T')[0];
    this.fechaMaxima = maxFecha.toISOString().split('T')[0];
  }


  validarFechas(): boolean {
    const fechaInicio = new Date(this.filtros.fechaInicio);
    const fechaFin = new Date(this.filtros.fechaFin);
    const hoy = new Date();
    const maxFecha = new Date();
    maxFecha.setFullYear(hoy.getFullYear() + 1);
  
    const hoyString = hoy.toISOString().split('T')[0]; 
    const fechaInicioString = fechaInicio.toISOString().split('T')[0];
    const fechaFinString = fechaFin.toISOString().split('T')[0]; 
  
    // Validar fecha de inicio no anterior a hoy
    if (fechaInicioString < hoyString) {
      alert('La fecha de inicio no puede ser anterior a hoy.');
      this.filtros.fechaInicio = hoyString;
      return false;
    }
  
    if (fechaFinString < fechaInicioString) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
      this.filtros.fechaFin = fechaInicioString; 
      return false;
    }
  
    if (fechaFinString > maxFecha.toISOString().split('T')[0]) {
      alert('El rango máximo permitido es de 1 año.');
      this.filtros.fechaFin = maxFecha.toISOString().split('T')[0];
      return false;
    }
  
    return true; 
  }
  
  
}

import { Component } from '@angular/core';
import{trigger, state, style, animate, transition} from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LugarService } from '../../../services/lugar.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-lugares-home',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './lugares-home.component.html',
  styleUrl: './lugares-home.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LugaresHomeComponent {

  lugares: any[] = [];
  lugaresFiltrados: any[] = [];
  categorias: any[] = [];

  filtros = {
    destino: '',
    ubicacion: '',
    categoria: null,
  };


  lugaresService: LugarService = inject(LugarService);
  router: Router = inject(Router);
  ngOnInit(): void {

    this.obtenerCategorias();  // Llamar al método para obtener categorías
    this.obtenerLugares();      // Llamar al método para obtener lugares
    const token = localStorage.getItem('authToken');

  }

  obtenerCategorias(): void {
    this.lugaresService.obtenerCategorias().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.categorias = response.data;
        } else {
          console.error('Error al obtener categorías:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
    });
  }

  obtenerLugares(): void {
    this.lugaresService.obtenerLugares().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.lugares = response.data;
          this.lugaresFiltrados = this.lugares;  // Mostrar todos los lugares inicialmente
        } else {
          console.error('Error al obtener lugares:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
    });
  }

  // Filtrar lugares por categoría al seleccionar una opción
  filtrarPorCategoria(): void {
    if (this.filtros.categoria) {
      this.lugaresFiltrados = this.lugares.filter(lugar => lugar.categoria_id === this.filtros.categoria);
    } else {
      this.lugaresFiltrados = this.lugares; // Mostrar todos si no hay filtro
    }
  }

  actualizarUbicacion(): void {
    const lugarSeleccionado = this.lugares.find(lugar => lugar.id === this.filtros.destino);
    if (lugarSeleccionado) {
      this.filtros.ubicacion = lugarSeleccionado.ubicacion;
    }
  }




  scrollLeft() {
    document.getElementById('scrollContainer')!.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    document.getElementById('scrollContainer')!.scrollBy({ left: 300, behavior: 'smooth' });
  }


}


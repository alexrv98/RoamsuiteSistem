import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LugarService } from '../../../services/lugar.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-lugares-home',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './lugares-home.component.html',
  styleUrls: ['./lugares-home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class LugaresHomeComponent implements OnInit {
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
  map: any; // Variable para almacenar el mapa

  ngOnInit(): void {
    this.obtenerCategorias(); // Llamar al método para obtener categorías
    this.obtenerLugares(); // Llamar al método para obtener lugares
    this.inicializarMapa(); // Inicializar el mapa
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
          this.lugaresFiltrados = [...this.lugares]; // Inicializa con todos los lugares
          this.agregarMarcadores(); // Actualizar mapa con los lugares
        } else {
          console.error('Error al obtener lugares:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
    });
  }

  filtrarPorCategoria(): void {
    console.log('Categoría seleccionada:', this.filtros.categoria);

    const categoriaSeleccionada = this.filtros.categoria
      ? Number(this.filtros.categoria)
      : undefined;

    this.lugaresService.obtenerLugares(categoriaSeleccionada).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.lugaresFiltrados = response.data;
          console.log('Lugares filtrados desde API:', this.lugaresFiltrados);
          this.agregarMarcadores(); // Actualizar mapa con lugares filtrados
        } else {
          console.error('Error al obtener lugares:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      },
    });
  }

  // Inicializar el mapa con Leaflet
  inicializarMapa(): void {
    this.map = L.map('map').setView([10.0, -84.0], 6); // Coordenadas iniciales

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  // Agregar marcadores de lugares en el mapa
  agregarMarcadores(): void {
    // Primero limpiamos el mapa de cualquier marcador previo
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    // Agregar nuevos marcadores
    this.lugaresFiltrados.forEach((lugar) => {
      if (lugar.latitud && lugar.longitud) {
        L.marker([lugar.latitud, lugar.longitud])
          .addTo(this.map)
          .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.ubicacion}`);
      }
    });
  }

  // Método que actualiza la ubicación según el destino seleccionado
  actualizarUbicacion(): void {
    const lugarSeleccionado = this.lugares.find(
      (lugar) => lugar.id === this.filtros.destino
    );
    if (lugarSeleccionado) {
      this.filtros.ubicacion = lugarSeleccionado.ubicacion;
    }
  }

  // Métodos para el desplazamiento horizontal en el contenedor
  scrollLeft() {
    document
      .getElementById('scrollContainer')!
      .scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    document
      .getElementById('scrollContainer')!
      .scrollBy({ left: 300, behavior: 'smooth' });
  }
}

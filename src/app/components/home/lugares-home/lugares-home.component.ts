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
    this.inicializarMapa();

    setTimeout(() => {
      this.inicializarMapa();
    }, 500); // Espera 500ms para asegurarse de que el div del mapa está renderizado
  }// Inicializar el mapa


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
        console.log("Respuesta de la API con coordenadas:", response);

        if (response.status === "success") {
          this.lugares = response.data;

          this.lugares.forEach((lugar) => {
            lugar.latitud = Number(lugar.latitud);
            lugar.longitud = Number(lugar.longitud);
          });

          this.lugaresFiltrados = [...this.lugares];
          this.agregarMarcadores();
        } else {
          console.error("Error al obtener lugares:", response.message);
        }
      },
      error: (error) => {
        console.error("Error en la petición:", error);
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
    if (this.map) return; // Evita reiniciar el mapa si ya está creado

    this.map = L.map('map').setView([10.0, -84.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }
  verMas(lugar: any): void {
    if (!this.map) {
      console.error("El mapa aún no está inicializado.");
      return;
    }

    const lat = Number(lugar.latitud);
    const lng = Number(lugar.longitud);

    if (!isNaN(lat) && !isNaN(lng)) {
      console.log(`Centrando el mapa en: ${lugar.nombre} (${lat}, ${lng})`);

      this.map.flyTo([lat, lng], 12, { duration: 1.5 });

      // Eliminar marcadores anteriores
      this.marcadores.forEach((marker) => this.map.removeLayer(marker));
      this.marcadores = [];

      // Agregar nuevo marcador
      const marcador = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.ubicacion}`)
        .openPopup();

      this.marcadores.push(marcador);
    } else {
      console.warn("El lugar seleccionado no tiene coordenadas válidas.");
    }
  }


  // Agregar una propiedad para almacenar marcadores
private marcadores: L.Marker[] = [];

agregarMarcadores(): void {
  if (!this.map) return; // Evitar errores si el mapa aún no está listo

  // Eliminar marcadores anteriores del mapa
  this.marcadores.forEach((marker) => this.map.removeLayer(marker));
  this.marcadores = []; // Vaciar el array de marcadores

  // Si hay lugares, centrar en el primer lugar
  if (this.lugaresFiltrados.length > 0) {
    const primerLugar = this.lugaresFiltrados[0];
    if (primerLugar.latitud && primerLugar.longitud) {
      this.map.setView([primerLugar.latitud, primerLugar.longitud], 10);
    }
  }

  // Agregar nuevos marcadores
  this.lugaresFiltrados.forEach((lugar) => {
    if (lugar.latitud && lugar.longitud) {
      const marcador = L.marker([lugar.latitud, lugar.longitud])
        .addTo(this.map)
        .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.ubicacion}`);

      this.marcadores.push(marcador); // Guardar marcador en el array
    }
  });
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

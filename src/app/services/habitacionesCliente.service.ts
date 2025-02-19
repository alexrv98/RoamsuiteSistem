import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class HabitacionesClienteService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  obtenerHabitaciones(filtros: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/buscarHabitaciones.php`, filtros);
  }

  // En HabitacionesClienteService
  getImagenesHabitacion(habitacionId: number): Observable<any> {
    // ✅ Este es el nombre correcto
    return this.http.get(
      `${this.apiUrl}/imagenes_habitacion.php?habitacion_id=${habitacionId}`
    );
  }
  // obtenerHotelbyId(hotelId: number): Observable
  // <any> {
  //   return this.http.get(`${this.apiUrl}/getHotelById.php?id=${hotelId}`);
  // }
}

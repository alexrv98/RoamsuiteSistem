import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';  

@Injectable({
  providedIn: 'root',
})
export class HabitacionesService {
  private apiUrl = API_CONFIG.baseUrl; 

  constructor(private http: HttpClient) {}

  obtenerHabitaciones(filtros: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/buscarHabitaciones.php`, filtros); 
  }
}

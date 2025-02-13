import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  obtenerHabitaciones(hotelId: number): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('No hay sesión iniciada. Inicie sesión para ver las habitaciones.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/listHabitaciones.php?hotel_id=${hotelId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener habitaciones:', error);
        return throwError(() => new Error('Error al obtener las habitaciones.'));
      })
    );
  }
}

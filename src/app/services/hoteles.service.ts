import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  obtenerHotelesDisponibles(filtros: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/buscarHoteles.php`, filtros);  
  }

  obtenerHoteles(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('No hay sesión iniciada. Inicie sesión para ver sus hoteles.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/listHoteles.php`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener hoteles:', error);
        return throwError(() => new Error('Error al obtener los hoteles.'));
      })
    );
  }
}

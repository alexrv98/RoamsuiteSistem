import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';  

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  obtenerToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/generar_token.php`); 
  }

  realizarReserva(datosReserva: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/reservar_sin_cuenta.php`, datosReserva, { headers });  // Endpoint específico
  }
}

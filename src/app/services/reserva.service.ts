import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = 'http://192.168.1.102/HTLES/AAJHoteles/apisHoteles/reservar_sin_cuenta.php'; 
  private tokenUrl = 'http://192.168.1.102/HTLES/AAJHoteles/apisHoteles/generar_token.php';

  constructor(private http: HttpClient) {}

  obtenerToken(): Observable<any> {
    return this.http.get<any>(this.tokenUrl);
  }

  realizarReserva(datosReserva: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, datosReserva, { headers });
  }
}

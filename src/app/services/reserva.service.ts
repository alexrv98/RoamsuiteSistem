import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = 'http://192.168.1.102/HTLES/AAJHoteles/apisHoteles/reservar_sin_cuenta.php'; 

  constructor(private http: HttpClient) {}

  realizarReserva(datosReserva: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datosReserva);
  }
}

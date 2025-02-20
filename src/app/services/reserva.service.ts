import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../api.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  realizarReserva(datosReserva: any): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('Token no disponible. Debes iniciar sesión.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/reservar_con_cuenta.php`, datosReserva, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en la reserva:', error);
          return throwError(() => error); 
        })
      );
  }

 

  obtenerReservacionesUsuario(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      return throwError(() => new Error('No hay sesión iniciada. Inicie sesión para ver sus reservaciones.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/listreservacionesusuario.php`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener reservaciones:', error);
        return throwError(() => new Error('Error al obtener reservaciones.'));
      })
    );
  }

  obtenerReservacionesAdmin(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No hay sesión iniciada.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(`${this.apiUrl}/listaReservasHoteles.php`, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener reservaciones del hotel:', error);
        return throwError(() => new Error('Error al obtener las reservaciones.'));
      })
    );
  }


  realizarPago(datosPago: any): Observable<any> {
    return this.http.post<any>('http://192.168.1.102/sistemaExam/procesar_pago.php', datosPago);
  }
  
  

  cancelarReserva(idReserva: number): Observable<any> {
    return this.http.post<any>('http://192.168.1.102/sistemaExam/cancelar_reserva.php', { id: idReserva });
  }
  
  
  
}

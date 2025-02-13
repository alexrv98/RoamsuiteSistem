import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../api.config';
import { tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}


agregarComentario(hotel_id: number, calificacion: number, comentario: string): Observable<any> {
  const token = this.authService.getToken();
  if (!token) {
    return throwError(() => new Error('Usuario no autenticado')); 
  }

  return this.authService.obtenerUsuarioLogueado(token).pipe(
    switchMap((usuario) => {
      const nombreUsuario = usuario.nombre;
      const body = {
        hotel_id,
        calificacion,
        comentario,
        nombre_usuario: nombreUsuario,
      };

      return this.http.post(`${this.apiUrl}/comentarios.php`, body);
    })
  );
}


  getComentarios(hotel_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/comentarios.php?hotel_id=${hotel_id}`);
  }
}

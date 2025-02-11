import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../api.config'; 

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {
  private apiUrl = API_CONFIG.baseUrl; 

  constructor(private http: HttpClient) {}

  getComentarios(hotel_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/comentarios.php?hotel_id=${hotel_id}`); 
  }
}

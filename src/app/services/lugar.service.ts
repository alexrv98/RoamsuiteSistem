import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LugarService {
  private baseUrl = 'http://192.168.1.102/HTLES/AAJHoteles/apisHoteles';

  constructor(private http: HttpClient) {}

  obtenerLugares(categoria_id?: number): Observable<any> {
    let url = `${this.baseUrl}/listLugaresTuristicos.php`;
    if (categoria_id) {
      url += `?categoria_id=${categoria_id}`;
    }
    return this.http.get(url);
  }

  obtenerDestinoPorId(destinoId: number): Observable<any> {
    const url = `${this.baseUrl}/getDestinoPorId.php?id=${destinoId}`;
    return this.http.get(url);
  }

  obtenerCategorias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias.php`);
  }
}

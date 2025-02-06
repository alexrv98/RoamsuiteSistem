import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LugarService {
  private baseUrl = 'http://192.168.1.102/HTLES/AAJHoteles/apisHoteles'; // Cambia esto por la URL real

  constructor(private http: HttpClient) {}

  obtenerLugares(): Observable<any> {
    return this.http.get(`${this.baseUrl}/listLugaresTuristicos.php`);
  }

  obtenerCategorias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias.php`);
  }
}

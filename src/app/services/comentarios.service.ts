import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {


  constructor(private http: HttpClient) {}


  getComentarios(hotel_id: number): Observable<any> {
    return this.http.get(`${this.http}/comentarios.php?hotel_id=${hotel_id}`);
  }


}


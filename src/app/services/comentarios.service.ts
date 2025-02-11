import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://192.168.1.102/HTLES/AAJHoteles/apisHoteles';

  getComentarios(hotel_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/comentarios.php?hotel_id=${hotel_id}`);
  }

  

}





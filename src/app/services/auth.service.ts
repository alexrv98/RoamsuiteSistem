import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://192.168.1.102/HTLES/AAJHoteles/apisHoteles';
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, { correo, password }).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          this.tokenSubject.next(response.token);
          console.log('Token almacenado en memoria:', response.token); // 🔹 Imprime el token en consola
        }
      })
    );
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  logout(): void {
    this.tokenSubject.next(null);
    console.log('Token eliminado'); // 🔹 Confirma que el token se borra al cerrar sesión
  }
}

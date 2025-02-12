import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://192.168.1.102/AAJHoteles/Hoteles/apisHoteles/';
  public tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromSessionStorage());

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, { correo, password }).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          this.tokenSubject.next(response.token);
          this.storeTokenInSession(response.token); // Almacenar el token en sessionStorage
          console.log('Token almacenado en memoria:', response.token);
        }
      })
    );
  }

  // Método para obtener los datos del usuario logueado
  obtenerUsuarioLogueado(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario.php`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  estaAutenticado(): boolean {
    return this.tokenSubject.value !== null;
  }

  logout(): void {
    this.tokenSubject.next(null);
    this.removeTokenFromSession(); 
    console.log('Token eliminado');
  }

  private storeTokenInSession(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  private getTokenFromSessionStorage(): string | null {
    return sessionStorage.getItem('authToken');
  }

  private removeTokenFromSession(): void {
    sessionStorage.removeItem('authToken');
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, data);
  }
}

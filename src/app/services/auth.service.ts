// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from '../api.config';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = API_CONFIG.baseUrl;

  public tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromSessionStorage());
  public nombreUsuarioSubject = new BehaviorSubject<string | null>(null); 
  public rolUsuarioSubject = new BehaviorSubject<string | null>(null);


  constructor(private http: HttpClient) {}


  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login.php`, { correo, password }).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          this.tokenSubject.next(response.token);
          this.storeTokenInSession(response.token);
  
          
          this.obtenerUsuarioLogueado(response.token).subscribe(usuario => {
            this.nombreUsuarioSubject.next(usuario.nombre);
            this.rolUsuarioSubject.next(usuario.rol);
          });
        }
      })
    );
  }
  
  getRolUsuario(): Observable<string | null> {
    return this.rolUsuarioSubject.asObservable();
  }
  


  obtenerUsuarioLogueado(token: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/usuario.php`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  estaAutenticado(): boolean {
    return this.tokenSubject.value !== null;
  }

  logout(): void {
    this.tokenSubject.next(null);
    this.nombreUsuarioSubject.next(null); 
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

  getNombreUsuario(): Observable<string | null> {
    return this.nombreUsuarioSubject.asObservable();
  }


}

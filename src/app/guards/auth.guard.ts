import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Verificar que el usuario esté autenticado
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/']);
      return of(false);
    }

    if (state.url === '/admin') {
      const token = this.authService.getToken();
      return this.authService.obtenerUsuarioLogueado(token!).pipe(
        map((response) => {
          if (response.status === 'success' && response.usuario && response.usuario.rol === 'admin') {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        }),
        catchError((error) => {
          this.router.navigate(['/']);
          return of(false);
        })
      );
    }
    return of(true);
  }
}

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports:[RouterLink, CommonModule],
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  nombreUsuario: string = '';  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.estaAutenticado();
    if (this.isAuthenticated) {
      const token = this.authService.getToken();
      this.authService.obtenerUsuarioLogueado(token!).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.nombreUsuario = response.usuario.nombre; 
          } else {
            console.error('Error al obtener el usuario');
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      });
    }
    this.authService.tokenSubject.subscribe(token => {
      this.isAuthenticated = token !== null;
    });
  }

  logout(): void {
    this.authService.logout();
    console.log('Sesión cerrada correctamente');
    this.router.navigate(['/']);
  }
}

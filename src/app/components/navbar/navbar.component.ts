import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports:[RouterLink, CommonModule],
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.estaAutenticado();
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

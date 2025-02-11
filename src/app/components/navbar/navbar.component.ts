import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {


  constructor(private authService: AuthService, private router: Router) {}
  
    logout(): void {
      this.authService.logout();
      console.log('Sesión cerrada correctamente');
      this.router.navigate(['/login']);
    }
}




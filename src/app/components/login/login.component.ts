import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  

  onLogin(): void {
    this.authService.login(this.correo, this.password).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          const userRole = response.rol;
          const state = history.state;
  
          if (state.reserva) {
            this.router.navigate(['/confirmar-reserva'], { state: { reserva: state.reserva } });
          } else {
            this.router.navigate([userRole === 'admin' ? '/admin' : '/']);
          }
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.errorMessage = 'Error en el servidor. Intente nuevamente.';
      },
    });
  }
  
  
}

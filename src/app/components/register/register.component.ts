import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registroForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['usuario'],
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const formData = {
        ...this.registroForm.value,
        rol: 'usuario',
      };

      this.authService.register(formData).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            alert('Usuario registrado con éxito');
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (err) => {
          console.error('Error al registrar:', err);
          this.errorMessage = 'Error en el servidor. Intente nuevamente.';
        },
      });
    }
  }
}

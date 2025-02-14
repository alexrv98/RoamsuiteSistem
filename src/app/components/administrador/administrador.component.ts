import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HabitacionesAdminComponent } from './habitaciones-admin/habitaciones-admin.component';
@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    NavbarComponent,
    HabitacionesAdminComponent,
  ],
  styleUrl: './administrador.component.css',
})
export class AdministradorComponent implements OnInit {
  hoteles: any[] = [];
  isLoading: boolean = true; // Indicador de carga

  constructor(
    private authService: AuthService,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.cargarHoteles();
  }

  cargarHoteles(): void {
    this.hotelService.obtenerHoteles().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.hoteles = response.data;
  
          // Verificar si el usuario tiene un hotel asignado
          if (this.hoteles.length === 0) {
            console.warn('Este administrador no tiene un hotel asignado.');
          } else {
            console.log('Hoteles asignados al admin:', this.hoteles);
          }
        } else {
          console.error('Error al obtener hoteles:', response.message);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar hoteles:', error);
      },
    });
  }
  

  logout(): void {
    this.authService.logout();
    console.log('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }


  
}

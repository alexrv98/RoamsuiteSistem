import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hoteles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  imports: [CommonModule, FormsModule, FooterComponent, NavbarComponent],
  styleUrl: './administrador.component.css',
})
export class AdministradorComponent implements OnInit {
  hoteles: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.cargarHoteles();
  }

  cargarHoteles(): void {
    this.hotelService.obtenerHoteles().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.hoteles = response.data;
        } else {
          console.error('Error al obtener hoteles:', response.message);
        }
      },
      (error) => {
        console.error('Error al cargar hoteles:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    console.log('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }
}

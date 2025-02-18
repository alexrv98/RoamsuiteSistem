import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LugarService } from '../../../services/lugar.service';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-reserva',
  templateUrl: './modal-reserva.component.html',
  imports: [CommonModule],
  styleUrls: ['./modal-reserva.component.css'],
})
export class ModalReservaComponent {
  @Input() habitacion: any = null;
  @Input() filtros: any = null;
  precioTotal: number = 0;

  constructor(private router: Router, private lugarService: LugarService,
    private authService: AuthService
  ) {}
 


  continuarReserva() {
    const reserva = {
      habitacion: this.habitacion,
      filtros: this.filtros,
      destino: '',      
    };
  
    this.lugarService.obtenerDestinoPorId(this.filtros?.destino)
      .pipe(take(1)) 
      .subscribe((response) => {
  
        if (response.status === 'success') {
          // Si todo es correcto, asigna el destino al objeto reserva
          reserva.destino = response.data.nombre;
  
          const usuarioAutenticado = this.authService.estaAutenticado();
          const ruta = usuarioAutenticado ? '/confirmar-reserva' : '/login';
  
          // Aquí pasas el objeto completo 'reserva' a la siguiente vista
          this.router.navigate([ruta], { state: { reserva }, replaceUrl: usuarioAutenticado });
        } else {
          alert('Error al obtener el destino');
        }
      });
  }
  
  
  
}

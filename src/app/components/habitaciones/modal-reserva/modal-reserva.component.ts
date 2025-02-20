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

  @Input() filtrosOriginales: any = null;
  precioTotal: number = 0;

  constructor(private router: Router, private lugarService: LugarService,
    private authService: AuthService
  ) {}

  continuarReserva() {
  const reserva = {
    habitacion: this.habitacion, 
    fechaInicio: this.filtrosOriginales.fechaInicio,  // Usamos los filtros originales
    fechaFin: this.filtrosOriginales.fechaFin,    
        destino: '',
  };

  this.lugarService.obtenerDestinoPorId(this.filtrosOriginales?.destino)
    .pipe(take(1))
    .subscribe((response) => {
      if (response.status === 'success') {
        reserva.destino = response.data.nombre;

        const usuarioAutenticado = this.authService.estaAutenticado();
        const ruta = usuarioAutenticado ? '/confirmar-reserva' : '/login';

        this.router.navigate([ruta], { state: { reserva }, replaceUrl: usuarioAutenticado });
      } else {
        alert('Error al obtener el destino');
      }
    });
}

  
}

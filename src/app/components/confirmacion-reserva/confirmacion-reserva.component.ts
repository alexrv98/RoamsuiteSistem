import { Component, Input, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmacion-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmacion-reserva.component.html',
  styleUrls: ['./confirmacion-reserva.component.css'],
})
export class ConfirmarReservaComponent implements OnInit {
    @Input() filtros: any = null;
    
  reserva: any;
  cliente = { nombre: '', email: '', telefono: '' };

  constructor(
    private router: Router,
    private reservaService: ReservaService
  ) { }

  ngOnInit() {
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop')?.remove();

    const state = history.state;
    if (state.reserva) {
      this.reserva = state.reserva;
    } else {
      this.router.navigate(['/']);
    }
  }

  confirmarReserva() {
    const datosReserva = {
      ...this.reserva,
      nombre: this.cliente.nombre,
      email: this.cliente.email,
      telefono: this.cliente.telefono,
    };

    this.reservaService.realizarReserva(datosReserva).subscribe(
      (res) => {
        if (res.status === 'success') {
          alert('Reserva confirmada con éxito');
          this.reserva = null;

          this.router.navigate(['/'], { replaceUrl: true });
        } else {
          alert('Error al realizar la reserva');
        }
      },
      (error) => {
        console.error('Error en la reserva:', error);
      }
    );
  }


}

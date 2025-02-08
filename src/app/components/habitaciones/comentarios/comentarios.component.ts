import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comentarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {



  comentarios: any[] = [];
  nuevoComentario = { nombre: '', texto: '', calificacion: 0 };
  estrellas = [1, 2, 3, 4, 5];

  agregarComentario() {
    if (this.nuevoComentario.nombre && this.nuevoComentario.texto) {
      this.comentarios.push({ ...this.nuevoComentario });
      this.nuevoComentario = { nombre: '', texto: '', calificacion: 0 }; // Limpiar formulario
    }
  }

  seleccionarCalificacion(valor: number) {
    this.nuevoComentario.calificacion = valor;
  }

}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comentarios',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  comentarios: any[] = [];
  nuevoComentario = { nombre: '', texto: '', calificacion: 0, fecha: '', foto: '' };
  estrellas = [1, 2, 3, 4, 5];
  comentariosMostrados = 2;  // Mostrar solo dos comentarios inicialmente
  @Input() hotelId: number | null = null;  // Recibir hotelId como input

  ngOnInit(): void {
    this.cargarComentarios();  // Cargar comentarios desde el LocalStorage
  }

  cargarComentarios(): void {
    const comentariosGuardados = localStorage.getItem('comentarios');
    if (comentariosGuardados) {
      this.comentarios = JSON.parse(comentariosGuardados);  // Convertir de JSON a array
    }
  }

  agregarComentario(): void {
    if (this.nuevoComentario.nombre && this.nuevoComentario.texto) {
      this.nuevoComentario.fecha = new Date().toISOString();  // Asignar fecha de publicación
      this.comentarios.push({ ...this.nuevoComentario });
      this.guardarComentarios();  // Guardar comentarios en el LocalStorage
      this.nuevoComentario = { nombre: '', texto: '', calificacion: 0, fecha: '', foto: '' }; // Limpiar formulario
    }
  }

  guardarComentarios(): void {
    localStorage.setItem('comentarios', JSON.stringify(this.comentarios));  // Guardar comentarios en el LocalStorage
  }

  seleccionarCalificacion(valor: number): void {
    this.nuevoComentario.calificacion = valor;
  }

  verMas(): void {
    this.comentariosMostrados += 2;  // Incrementar la cantidad de comentarios mostrados
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.nuevoComentario.foto = reader.result as string;  // Guardar la imagen en el comentario
      };
      reader.readAsDataURL(file);  // Convertir el archivo a base64
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComentariosService } from '../../services/comentarios.service';

@Component({
  selector: 'app-list-comentarios',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-comentarios.component.html',
  styleUrl: './list-comentarios.component.css',
})
export class ListComentariosComponent {
  comentarios: any[] = [];
  hotelId: number | null = null;
  calificacion: number = 5;
  comentario: string = '';

  constructor(
    private comentarioService: ComentariosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('hotelId');
      if (id) {
        this.hotelId = Number(id);
        this.cargarComentarios();
      }
    });
  }

  cargarComentarios(): void {
    if (this.hotelId) {
      this.comentarioService.getComentarios(this.hotelId).subscribe({
        next: (data: any) => {
          if (data.status === 'success') {
            this.comentarios = data.data;
          }
        },
        error: (error) => {
          console.error('Error al cargar comentarios', error);
        },
        complete: () => {
          console.log('Carga de comentarios completada');
        },
      });
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lista-hoteles',
  templateUrl: './lista-hoteles.component.html',
  imports: [CommonModule],
  styleUrls: ['./lista-hoteles.component.css'],
})
export class ListaHotelesComponent {
  @Input() hoteles: any[] = [];
}

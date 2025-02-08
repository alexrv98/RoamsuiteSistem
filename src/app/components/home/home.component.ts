import { Component } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { ListaHotelesComponent } from '../lista-hoteles/lista-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LugaresHomeComponent } from "./lugares-home/lugares-home.component";
import { CommonModule } from '@angular/common';
import { ComentariosComponent } from "./comentarios/comentarios.component";

@Component({
  selector: 'app-home',
  imports: [FiltroHotelesComponent, ListaHotelesComponent, NavbarComponent, LugaresHomeComponent, CommonModule, ComentariosComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  hoteles: any[] = []; 
  filtros: any = {
    destino: null,
    fechaInicio: null,
    fechaFin: null,
    huespedes: 1,
  };


}


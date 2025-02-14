import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaHotelesComponent } from "./components/lista-hoteles/lista-hoteles.component";
import { LugaresHomeComponent } from "./components/home/lugares-home/lugares-home.component";
import { ComentariosComponent } from './components/habitaciones/comentarios/comentarios.component';
import { MigajaComponent } from './components/usuario/mis-reservas/migaja/migaja.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListaHotelesComponent, LugaresHomeComponent, ComentariosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AAJHoteles';
}
//


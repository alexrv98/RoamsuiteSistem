import { Component } from '@angular/core';
import { FiltroHotelesComponent } from '../filtro-hoteles/filtro-hoteles.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LugaresHomeComponent } from './lugares-home/lugares-home.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { MigajaComponent } from "../usuario/mis-reservas/migaja/migaja.component";
@Component({
  selector: 'app-home',
  imports: [
    FooterComponent,
    FiltroHotelesComponent,
    NavbarComponent,
    LugaresHomeComponent,
    CommonModule,
    MigajaComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

}

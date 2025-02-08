import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaHotelesComponent } from './components/lista-hoteles/lista-hoteles.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ConfirmarReservaComponent } from './components/confirmacion-reserva/confirmacion-reserva.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'buscar/:destino/:fechaInicio/:fechaFin/:huespedes', component: ListaHotelesComponent },
  { path: 'habitaciones/:hotelId', component: HabitacionesComponent },
  { path: 'confirmar-reserva', component: ConfirmarReservaComponent }

];

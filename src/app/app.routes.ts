import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaHotelesComponent } from './components/lista-hoteles/lista-hoteles.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ConfirmarReservaComponent } from './components/confirmacion-reserva/confirmacion-reserva.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { LoginComponent } from './components/login/login.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { MisReservasComponent } from './components/usuario/mis-reservas/mis-reservas.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdministradorComponent, canActivate: [AuthGuard] },
  { path: 'buscar', component: ListaHotelesComponent },
  { path: 'habitaciones/:hotelId', component: HabitacionesComponent },
  { path: 'confirmar-reserva', component: ConfirmarReservaComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'comentarios/:hotelId', component: ComentariosComponent },
  {
    path: 'mis-reservaciones',
    component: MisReservasComponent, 
    canActivate: [AuthGuard],
  },
];

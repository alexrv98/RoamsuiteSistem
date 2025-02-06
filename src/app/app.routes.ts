import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaHotelesComponent } from './components/lista-hoteles/lista-hoteles.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'buscar/:destino/:fechaInicio/:fechaFin/:huespedes', component: ListaHotelesComponent },
  
];

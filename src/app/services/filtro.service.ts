import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltroService {
  private filtrosIniciales = {
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
  };

  private filtrosSubject = new BehaviorSubject<any>(this.filtrosIniciales);
  filtros$ = this.filtrosSubject.asObservable(); 
  actualizarFiltros(nuevosFiltros: any) {
    this.filtrosSubject.next(nuevosFiltros);
  }
}

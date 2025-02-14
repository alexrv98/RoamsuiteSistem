import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = API_CONFIG.baseUrl; 

  constructor(private http: HttpClient) {}

  
}

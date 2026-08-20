import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Car } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly http = inject(HttpClient);

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>('data/cars.json');
  }
}

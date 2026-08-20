import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { Car } from '../models/car.model';
import { RiskIndicator } from '../models/risk-indicator.model';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly http = inject(HttpClient);

  private readonly cars$ = this.http
    .get<Car[]>('data/cars.json')
    .pipe(shareReplay(1));

  private readonly featurePricing$ = this.http
    .get<Record<string, number>>('data/feature-pricing.json')
    .pipe(shareReplay(1));

  private readonly riskIndicators$ = this.http
    .get<Record<string, RiskIndicator>>('data/risk-indicators.json')
    .pipe(shareReplay(1));

  getCars(): Observable<Car[]> {
    return this.cars$;
  }

  getFeaturePricing(): Observable<Record<string, number>> {
    return this.featurePricing$;
  }

  getRiskIndicators(): Observable<Record<string, RiskIndicator>> {
    return this.riskIndicators$;
  }
}

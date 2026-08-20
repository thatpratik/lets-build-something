import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { Car } from '../../core/models/car.model';
import { RiskIndicator } from '../../core/models/risk-indicator.model';
import { CarService } from '../../core/services/car.service';
import { DetailService } from '../../core/services/detail.service';

@Component({
  selector: 'app-car-detail',
  imports: [DecimalPipe],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.scss',
})
export class CarDetailComponent {
  private readonly carService = inject(CarService);
  protected readonly detailService = inject(DetailService);

  private readonly allCars = signal<Car[]>([]);
  private readonly riskIndicators = signal<Record<string, RiskIndicator>>({});

  protected readonly car = computed(() =>
    this.allCars().find((car) => car.id === this.detailService.carId()) ?? null
  );

  protected readonly risk = computed<RiskIndicator | null>(
    () => this.riskIndicators()[this.detailService.carId() ?? ''] ?? null
  );

  constructor() {
    this.carService.getCars().subscribe((cars) => this.allCars.set(cars));
    this.carService.getRiskIndicators().subscribe((indicators) => this.riskIndicators.set(indicators));
  }

  protected close(): void {
    this.detailService.closeDetail();
  }
}

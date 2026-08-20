import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { Car } from '../../core/models/car.model';
import { RiskIndicator } from '../../core/models/risk-indicator.model';
import { CarService } from '../../core/services/car.service';
import { DetailService } from '../../core/services/detail.service';
import { MeterComponent } from '../../shared/meter/meter.component';

const MAX_DISPLAY_RANGE_KM = 600;

@Component({
  selector: 'app-car-detail',
  imports: [DecimalPipe, MeterComponent],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.scss',
})
export class CarDetailComponent {
  protected readonly maxDisplayRangeKm = MAX_DISPLAY_RANGE_KM;
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

  protected batteryTone(retentionPercent: number): 'accent' | 'warning' | 'danger' {
    if (retentionPercent < 80) {
      return 'danger';
    }
    if (retentionPercent < 90) {
      return 'warning';
    }
    return 'accent';
  }

  protected resaleToneClasses(rating: RiskIndicator['resaleValue']['rating']): string {
    switch (rating) {
      case 'Strong':
        return 'bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]';
      case 'Average':
        return 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]';
      case 'Weak':
        return 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]';
    }
  }
}

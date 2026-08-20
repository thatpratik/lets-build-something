import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { Car } from '../../core/models/car.model';
import { CarService } from '../../core/services/car.service';
import { ComparisonService } from '../../core/services/comparison.service';

@Component({
  selector: 'app-comparison',
  imports: [DecimalPipe],
  templateUrl: './comparison.component.html',
  styleUrl: './comparison.component.scss',
})
export class ComparisonComponent {
  private readonly carService = inject(CarService);
  protected readonly comparisonService = inject(ComparisonService);

  private readonly allCars = signal<Car[]>([]);
  private readonly featurePricing = signal<Record<string, number>>({});

  private readonly activeFeatures = signal<Map<string, Set<string>>>(new Map());

  protected readonly allFeatures = computed(() => Object.keys(this.featurePricing()).sort());

  protected readonly comparedCars = computed(() => {
    const ids = this.comparisonService.selectedIds();
    return this.allCars().filter((car) => ids.has(car.id));
  });

  protected readonly carPrices = computed(() => {
    const pricing = this.featurePricing();
    const active = this.activeFeatures();
    const prices = new Map<string, number>();

    for (const car of this.comparedCars()) {
      const carActiveFeatures = active.get(car.id) ?? new Set(car.features);
      let price = car.price;

      for (const feature of this.allFeatures()) {
        const hadFeature = car.features.includes(feature);
        const hasFeatureNow = carActiveFeatures.has(feature);
        if (hasFeatureNow && !hadFeature) {
          price += pricing[feature] ?? 0;
        } else if (!hasFeatureNow && hadFeature) {
          price -= pricing[feature] ?? 0;
        }
      }

      prices.set(car.id, price);
    }

    return prices;
  });

  constructor() {
    this.carService.getCars().subscribe((cars) => {
      this.allCars.set(cars);
      this.resetActiveFeatures(cars);
    });
    this.carService.getFeaturePricing().subscribe((pricing) => this.featurePricing.set(pricing));
  }

  private resetActiveFeatures(cars: Car[]): void {
    const ids = this.comparisonService.selectedIds();
    const next = new Map<string, Set<string>>();
    for (const car of cars) {
      if (ids.has(car.id)) {
        next.set(car.id, new Set(car.features));
      }
    }
    this.activeFeatures.set(next);
  }

  protected hasFeature(carId: string, feature: string): boolean {
    return this.activeFeatures().get(carId)?.has(feature) ?? false;
  }

  protected priceFor(carId: string): number {
    return this.carPrices().get(carId) ?? 0;
  }

  protected toggleFeature(carId: string, feature: string): void {
    this.activeFeatures.update((current) => {
      const next = new Map(current);
      const carFeatures = new Set(next.get(carId) ?? []);
      if (carFeatures.has(feature)) {
        carFeatures.delete(feature);
      } else {
        carFeatures.add(feature);
      }
      next.set(carId, carFeatures);
      return next;
    });
  }

  protected close(): void {
    this.comparisonService.closeComparison();
  }

  protected removeFromComparison(carId: string): void {
    this.comparisonService.toggle(carId);
  }
}

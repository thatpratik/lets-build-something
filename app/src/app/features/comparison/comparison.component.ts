import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { thumbnail } from '../../core/image';
import { Car } from '../../core/models/car.model';
import { carTotalPrice } from '../../core/pricing';
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
  protected readonly carImages = signal<Record<string, string>>({});
  protected readonly failedImageIds = signal<Set<string>>(new Set());

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
      prices.set(car.id, carTotalPrice(car, pricing, carActiveFeatures));
    }

    return prices;
  });

  constructor() {
    this.carService.getCars().subscribe((cars) => {
      this.allCars.set(cars);
      this.resetActiveFeatures(cars);
    });
    this.carService.getFeaturePricing().subscribe((pricing) => this.featurePricing.set(pricing));
    this.carService.getCarImages().subscribe((images) => this.carImages.set(images));
  }

  protected thumbnailFor(url: string): string {
    return thumbnail(url, 200);
  }

  protected markImageFailed(carId: string): void {
    this.failedImageIds.update((current) => new Set(current).add(carId));
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

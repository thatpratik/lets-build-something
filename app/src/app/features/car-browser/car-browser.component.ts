import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Car } from '../../core/models/car.model';
import { carTotalPrice } from '../../core/pricing';
import { CarService } from '../../core/services/car.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { DetailService } from '../../core/services/detail.service';
import { MeterComponent } from '../../shared/meter/meter.component';
import { RangeSliderComponent } from '../../shared/range-slider/range-slider.component';

const BUDGET_TOLERANCE_DKK = 50000;
const RANGE_TOLERANCE_KM = 50;
const MAX_DISPLAY_RANGE_KM = 700;

function rangeBoundsOf(cars: Car[]): { min: number; max: number } {
  if (cars.length === 0) {
    return { min: 0, max: MAX_DISPLAY_RANGE_KM };
  }
  return {
    min: Math.min(...cars.map((car) => car.range.min)),
    max: Math.max(...cars.map((car) => car.range.max)),
  };
}

@Component({
  selector: 'app-car-browser',
  imports: [FormsModule, DecimalPipe, MeterComponent, RangeSliderComponent],
  templateUrl: './car-browser.component.html',
  styleUrl: './car-browser.component.scss',
})
export class CarBrowserComponent {
  protected readonly maxDisplayRangeKm = MAX_DISPLAY_RANGE_KM;
  private readonly carService = inject(CarService);
  protected readonly comparisonService = inject(ComparisonService);
  protected readonly detailService = inject(DetailService);

  protected readonly cars = signal<Car[]>([]);
  protected readonly carImages = signal<Record<string, string>>({});
  private readonly featurePricing = signal<Record<string, number>>({});
  protected readonly failedImageIds = signal<Set<string>>(new Set());

  protected readonly budget = signal<number | null>(null);
  protected readonly rangeBounds = computed(() => rangeBoundsOf(this.cars()));
  protected readonly desiredRangeMin = signal<number>(0);
  protected readonly desiredRangeMax = signal<number>(MAX_DISPLAY_RANGE_KM);
  protected readonly selectedFeatures = signal<Set<string>>(new Set());
  protected readonly selectedCountries = signal<Set<string>>(new Set());

  protected readonly hasRangePreference = computed(() => {
    const bounds = this.rangeBounds();
    return this.desiredRangeMin() > bounds.min || this.desiredRangeMax() < bounds.max;
  });

  protected readonly allFeatures = computed(() =>
    [...new Set(this.cars().flatMap((car) => car.features))].sort()
  );

  protected readonly allCountries = computed(() =>
    [...new Set(this.cars().map((car) => car.country))].sort()
  );

  private readonly strictlyFiltered = computed(() => {
    const countries = this.selectedCountries();
    const features = this.selectedFeatures();

    return this.cars().filter((car) => {
      const matchesCountry = countries.size === 0 || countries.has(car.country);
      const matchesFeatures = [...features].every((feature) => car.features.includes(feature));
      return matchesCountry && matchesFeatures;
    });
  });

  protected readonly recommendedCars = computed(() => {
    if (!this.hasPreferences()) {
      return [];
    }
    return this.strictlyFiltered().filter((car) => this.isWithinTolerance(car));
  });

  protected readonly otherCars = computed(() => {
    if (!this.hasPreferences()) {
      return this.strictlyFiltered();
    }
    return this.strictlyFiltered().filter((car) => !this.isWithinTolerance(car));
  });

  protected readonly hasPreferences = computed(() => this.budget() !== null || this.hasRangePreference());

  constructor() {
    this.carService.getCars().subscribe((cars) => {
      this.cars.set(cars);
      const bounds = rangeBoundsOf(cars);
      this.desiredRangeMin.set(bounds.min);
      this.desiredRangeMax.set(bounds.max);
    });
    this.carService.getCarImages().subscribe((images) => this.carImages.set(images));
    this.carService.getFeaturePricing().subscribe((pricing) => this.featurePricing.set(pricing));
  }

  protected markImageFailed(carId: string): void {
    this.failedImageIds.update((current) => new Set(current).add(carId));
  }

  protected totalPriceFor(car: Car): number {
    return carTotalPrice(car, this.featurePricing());
  }

  private isWithinTolerance(car: Car): boolean {
    const budget = this.budget();
    const withinBudget = budget === null || Math.abs(this.totalPriceFor(car) - budget) <= BUDGET_TOLERANCE_DKK;

    if (!this.hasRangePreference()) {
      return withinBudget;
    }
    const desiredMin = this.desiredRangeMin() - RANGE_TOLERANCE_KM;
    const desiredMax = this.desiredRangeMax() + RANGE_TOLERANCE_KM;
    const overlapsRange = car.range.max >= desiredMin && car.range.min <= desiredMax;
    return withinBudget && overlapsRange;
  }

  protected toggleFeature(feature: string): void {
    this.selectedFeatures.update((current) => this.toggleInSet(current, feature));
  }

  protected toggleCountry(country: string): void {
    this.selectedCountries.update((current) => this.toggleInSet(current, country));
  }

  private toggleInSet(set: Set<string>, value: string): Set<string> {
    const next = new Set(set);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    return next;
  }

  protected clearFilters(): void {
    const bounds = this.rangeBounds();
    this.budget.set(null);
    this.desiredRangeMin.set(bounds.min);
    this.desiredRangeMax.set(bounds.max);
    this.selectedFeatures.set(new Set());
    this.selectedCountries.set(new Set());
  }
}

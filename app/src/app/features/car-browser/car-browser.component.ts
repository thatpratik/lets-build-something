import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Car } from '../../core/models/car.model';
import { CarService } from '../../core/services/car.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { DetailService } from '../../core/services/detail.service';

const BUDGET_TOLERANCE_DKK = 50000;
const RANGE_TOLERANCE_KM = 50;

@Component({
  selector: 'app-car-browser',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './car-browser.component.html',
  styleUrl: './car-browser.component.scss',
})
export class CarBrowserComponent {
  private readonly carService = inject(CarService);
  protected readonly comparisonService = inject(ComparisonService);
  protected readonly detailService = inject(DetailService);

  protected readonly cars = signal<Car[]>([]);

  protected readonly budget = signal<number | null>(null);
  protected readonly desiredRange = signal<number | null>(null);
  protected readonly selectedFeatures = signal<Set<string>>(new Set());
  protected readonly selectedCountries = signal<Set<string>>(new Set());

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
    const budget = this.budget();
    const desiredRange = this.desiredRange();
    if (budget === null && desiredRange === null) {
      return [];
    }
    return this.strictlyFiltered().filter((car) => this.isWithinTolerance(car, budget, desiredRange));
  });

  protected readonly otherCars = computed(() => {
    const budget = this.budget();
    const desiredRange = this.desiredRange();
    if (budget === null && desiredRange === null) {
      return this.strictlyFiltered();
    }
    return this.strictlyFiltered().filter((car) => !this.isWithinTolerance(car, budget, desiredRange));
  });

  protected readonly hasPreferences = computed(() => this.budget() !== null || this.desiredRange() !== null);

  constructor() {
    this.carService.getCars().subscribe((cars) => this.cars.set(cars));
  }

  private isWithinTolerance(car: Car, budget: number | null, desiredRange: number | null): boolean {
    const withinBudget =
      budget === null || Math.abs(car.price - budget) <= BUDGET_TOLERANCE_DKK;
    const withinRange =
      desiredRange === null || Math.abs(car.range - desiredRange) <= RANGE_TOLERANCE_KM;
    return withinBudget && withinRange;
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
    this.budget.set(null);
    this.desiredRange.set(null);
    this.selectedFeatures.set(new Set());
    this.selectedCountries.set(new Set());
  }
}

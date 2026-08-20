import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import { Accessory } from '../../core/models/accessory.model';
import { Car } from '../../core/models/car.model';
import { ColorOption } from '../../core/models/color.model';
import { RiskIndicator } from '../../core/models/risk-indicator.model';
import { WarrantyInfo } from '../../core/models/warranty.model';
import { carFeatureLineItems, carTotalPrice } from '../../core/pricing';
import { CarService } from '../../core/services/car.service';
import { DetailService } from '../../core/services/detail.service';
import { MeterComponent } from '../../shared/meter/meter.component';

const MAX_DISPLAY_RANGE_KM = 700;

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
  private readonly warranty = signal<Record<string, WarrantyInfo>>({});
  private readonly colors = signal<Record<string, ColorOption[]>>({});
  private readonly selectedColorByCarId = signal<Record<string, string>>({});
  private readonly featurePricing = signal<Record<string, number>>({});
  protected readonly accessories = signal<Accessory[]>([]);
  protected readonly carImages = signal<Record<string, string>>({});
  protected readonly imageFailed = signal(false);

  protected readonly imageUrl = computed(() => this.carImages()[this.detailService.carId() ?? ''] ?? null);

  protected readonly car = computed(() =>
    this.allCars().find((car) => car.id === this.detailService.carId()) ?? null
  );

  protected readonly risk = computed<RiskIndicator | null>(
    () => this.riskIndicators()[this.detailService.carId() ?? ''] ?? null
  );

  protected readonly warrantyInfo = computed<WarrantyInfo | null>(
    () => this.warranty()[this.detailService.carId() ?? ''] ?? null
  );

  protected readonly carColors = computed<ColorOption[]>(
    () => this.colors()[this.detailService.carId() ?? ''] ?? []
  );

  protected readonly selectedColor = computed<ColorOption | null>(() => {
    const options = this.carColors();
    if (options.length === 0) {
      return null;
    }
    const carId = this.detailService.carId() ?? '';
    const selectedName = this.selectedColorByCarId()[carId];
    return options.find((option) => option.name === selectedName) ?? options[0];
  });

  protected readonly accessoriesTotal = computed(() =>
    this.accessories().reduce((sum, accessory) => sum + accessory.price, 0)
  );

  protected readonly featureLineItems = computed(() => {
    const car = this.car();
    return car === null ? [] : carFeatureLineItems(car, this.featurePricing());
  });

  protected readonly carPrice = computed(() => {
    const car = this.car();
    if (car === null) {
      return null;
    }
    return carTotalPrice(car, this.featurePricing()) + (this.selectedColor()?.priceDelta ?? 0);
  });

  protected readonly totalEstimatedCost = computed(() => {
    const price = this.carPrice();
    return price === null ? null : price + this.accessoriesTotal();
  });

  constructor() {
    this.carService.getCars().subscribe((cars) => this.allCars.set(cars));
    this.carService.getRiskIndicators().subscribe((indicators) => this.riskIndicators.set(indicators));
    this.carService.getAccessories().subscribe((accessories) => this.accessories.set(accessories));
    this.carService.getCarImages().subscribe((images) => this.carImages.set(images));
    this.carService.getFeaturePricing().subscribe((pricing) => this.featurePricing.set(pricing));
    this.carService.getWarranty().subscribe((warranty) => this.warranty.set(warranty));
    this.carService.getColors().subscribe((colors) => this.colors.set(colors));
  }

  protected close(): void {
    this.detailService.closeDetail();
  }

  protected selectColor(colorName: string): void {
    const carId = this.detailService.carId();
    if (carId === null) {
      return;
    }
    this.selectedColorByCarId.update((current) => ({ ...current, [carId]: colorName }));
  }

  protected markImageFailed(): void {
    this.imageFailed.set(true);
  }

  protected warrantyLabel(years: number, km: number): string {
    const kmLabel = km > 0 ? `${km.toLocaleString('da-DK')} km` : 'unlimited km';
    return `${years} yr / ${kmLabel}`;
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

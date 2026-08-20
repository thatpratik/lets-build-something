import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DetailService {
  private readonly openCarId = signal<string | null>(null);

  readonly isOpen = computed(() => this.openCarId() !== null);
  readonly carId = this.openCarId.asReadonly();

  openDetail(carId: string): void {
    this.openCarId.set(carId);
  }

  closeDetail(): void {
    this.openCarId.set(null);
  }
}

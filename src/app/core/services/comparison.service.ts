import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  private readonly selectedCarIds = signal<Set<string>>(new Set());
  private readonly comparisonOpen = signal(false);

  readonly selectedIds = this.selectedCarIds.asReadonly();
  readonly isOpen = this.comparisonOpen.asReadonly();
  readonly selectionCount = computed(() => this.selectedCarIds().size);

  isSelected(carId: string): boolean {
    return this.selectedCarIds().has(carId);
  }

  toggle(carId: string): void {
    this.selectedCarIds.update((current) => {
      const next = new Set(current);
      if (next.has(carId)) {
        next.delete(carId);
      } else {
        next.add(carId);
      }
      return next;
    });
  }

  clearSelection(): void {
    this.selectedCarIds.set(new Set());
  }

  openComparison(): void {
    this.comparisonOpen.set(true);
  }

  closeComparison(): void {
    this.comparisonOpen.set(false);
  }
}

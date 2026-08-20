import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
})
export class RangeSliderComponent {
  readonly min = input.required<number>();
  readonly max = input.required<number>();
  readonly step = input<number>(1);

  readonly low = model.required<number>();
  readonly high = model.required<number>();

  protected readonly lowPercent = computed(() => this.percentOf(this.low()));
  protected readonly highPercent = computed(() => this.percentOf(this.high()));

  protected onLowInput(value: number): void {
    this.low.set(Math.min(value, this.high()));
  }

  protected onHighInput(value: number): void {
    this.high.set(Math.max(value, this.low()));
  }

  private percentOf(value: number): number {
    const span = this.max() - this.min();
    if (span <= 0) {
      return 0;
    }
    return ((value - this.min()) / span) * 100;
  }
}

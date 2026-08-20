import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-meter',
  standalone: true,
  template: `
    <div class="flex items-center gap-2.5">
      <div class="relative h-1.5 flex-1 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          class="absolute inset-y-0 rounded-full transition-[left,width] duration-300 ease-out"
          [style.left.%]="clampedStart()"
          [style.width.%]="clampedWidth()"
          [style.background-color]="color()"
        ></div>
      </div>
      @if (showLabel()) {
        <span class="font-mono text-xs tabular-nums text-[var(--color-ink-muted)] w-9 text-right">
          {{ clampedEnd() }}%
        </span>
      }
    </div>
  `,
})
export class MeterComponent {
  readonly value = input.required<number>();
  readonly rangeStart = input<number>(0);
  readonly tone = input<'accent' | 'warning' | 'danger'>('accent');
  readonly showLabel = input<boolean>(true);

  protected readonly clampedStart = computed(() => Math.max(0, Math.min(100, Math.round(this.rangeStart()))));
  protected readonly clampedEnd = computed(() => Math.max(0, Math.min(100, Math.round(this.value()))));
  protected readonly clampedWidth = computed(() => Math.max(0, this.clampedEnd() - this.clampedStart()));

  protected readonly color = computed(() => {
    switch (this.tone()) {
      case 'warning':
        return 'var(--color-warning)';
      case 'danger':
        return 'var(--color-danger)';
      default:
        return 'var(--color-accent)';
    }
  });
}

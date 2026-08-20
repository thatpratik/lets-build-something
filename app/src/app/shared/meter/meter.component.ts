import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-meter',
  standalone: true,
  template: `
    <div class="flex items-center gap-2.5">
      <div class="h-1.5 flex-1 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          class="h-full rounded-full transition-[width] duration-300 ease-out"
          [style.width.%]="clamped()"
          [style.background-color]="color()"
        ></div>
      </div>
      <span class="font-mono text-xs tabular-nums text-[var(--color-ink-muted)] w-9 text-right">
        {{ clamped() }}%
      </span>
    </div>
  `,
})
export class MeterComponent {
  readonly value = input.required<number>();
  readonly tone = input<'accent' | 'warning' | 'danger'>('accent');

  protected readonly clamped = computed(() => Math.max(0, Math.min(100, Math.round(this.value()))));

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

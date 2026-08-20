import { Component, computed, input } from '@angular/core';

const RADIUS = 40;
const ARC_LENGTH = Math.PI * RADIUS;
const TRACK_PATH = `M 8 50 A ${RADIUS} ${RADIUS} 0 0 1 92 50`;

@Component({
  selector: 'app-meter',
  standalone: true,
  template: `
    <div class="flex items-center gap-3">
      <svg viewBox="0 0 100 54" class="w-16 shrink-0" aria-hidden="true">
        <path [attr.d]="trackPath" fill="none" [attr.stroke]="trackColor()" stroke-width="9" stroke-linecap="round" />
        <path
          [attr.d]="trackPath"
          fill="none"
          [attr.stroke]="color()"
          stroke-width="9"
          stroke-linecap="round"
          [attr.stroke-dasharray]="dashArray()"
        />
      </svg>
      @if (showLabel()) {
        <span class="font-mono text-xs tabular-nums text-[var(--color-ink-muted)]">
          {{ clampedEnd() }}%
        </span>
      }
    </div>
  `,
})
export class MeterComponent {
  readonly value = input.required<number>();
  readonly rangeStart = input<number>(0);
  readonly tone = input<'accent' | 'good' | 'warning' | 'danger'>('accent');
  readonly showLabel = input<boolean>(true);
  readonly onInk = input<boolean>(false);

  protected readonly trackPath = TRACK_PATH;

  protected readonly clampedStart = computed(() => Math.max(0, Math.min(100, Math.round(this.rangeStart()))));
  protected readonly clampedEnd = computed(() => Math.max(0, Math.min(100, Math.round(this.value()))));

  protected readonly dashArray = computed(() => {
    const startLen = (this.clampedStart() / 100) * ARC_LENGTH;
    const endLen = (this.clampedEnd() / 100) * ARC_LENGTH;
    const segmentLen = Math.max(0, endLen - startLen);
    return `0 ${startLen.toFixed(2)} ${segmentLen.toFixed(2)} ${ARC_LENGTH.toFixed(2)}`;
  });

  protected readonly trackColor = computed(() =>
    this.onInk() ? 'var(--color-border-on-ink)' : 'var(--color-border)'
  );

  protected readonly color = computed(() => {
    switch (this.tone()) {
      case 'good':
        return 'var(--color-good)';
      case 'warning':
        return 'var(--color-warning)';
      case 'danger':
        return 'var(--color-danger)';
      default:
        return 'var(--color-accent)';
    }
  });
}

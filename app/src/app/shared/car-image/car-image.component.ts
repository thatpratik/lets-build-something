import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-car-image',
  standalone: true,
  template: `
    <div class="relative h-full w-full overflow-hidden bg-[var(--color-bg)]">
      @if (src() && !failed()) {
        <img
          [src]="src()"
          [alt]="alt()"
          loading="lazy"
          class="h-full w-full object-cover transition-opacity duration-500 ease-out"
          [class.opacity-0]="!loaded()"
          (load)="loaded.set(true)"
          (error)="failed.set(true)"
        />
        @if (!loaded()) {
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
            <span class="relative flex h-6 w-6 items-center justify-center">
              <span class="absolute h-full w-full rounded-full bg-[var(--color-accent)]/30 animate-ping"></span>
              <svg class="relative h-3.5 w-3.5 text-[var(--color-accent)]" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M9.2.6c.3.1.5.4.4.8L8.1 7h4.4c.3 0 .6.2.7.5.1.3 0 .6-.2.8l-7 7.1c-.3.3-.7.3-1 .1-.3-.2-.4-.5-.3-.9L6.2 9H1.9c-.3 0-.6-.2-.7-.5-.1-.3 0-.6.2-.8L8.4.6c.2-.2.5-.2.8 0Z" />
              </svg>
            </span>
            <span class="relative h-1 w-14 overflow-hidden rounded-full bg-[var(--color-border)]">
              <span class="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[var(--color-accent)] animate-[charge-sweep_1.1s_ease-in-out_infinite]"></span>
            </span>
          </div>
        }
      } @else {
        <div class="h-full w-full flex items-center justify-center px-2 text-center text-xs font-medium text-[var(--color-ink-muted)]">
          {{ fallbackText() }}
        </div>
      }
    </div>
  `,
})
export class CarImageComponent {
  readonly src = input<string | null>(null);
  readonly alt = input.required<string>();
  readonly fallbackText = input.required<string>();

  protected readonly loaded = signal(false);
  protected readonly failed = signal(false);
}

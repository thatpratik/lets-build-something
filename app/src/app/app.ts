import { Component, inject } from '@angular/core';

import { CarBrowserComponent } from './features/car-browser/car-browser.component';
import { ComparisonComponent } from './features/comparison/comparison.component';
import { ComparisonService } from './core/services/comparison.service';

@Component({
  imports: [CarBrowserComponent, ComparisonComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly comparisonService = inject(ComparisonService);
}

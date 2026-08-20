import { Component, inject } from '@angular/core';

import { CarBrowserComponent } from './features/car-browser/car-browser.component';
import { CarDetailComponent } from './features/car-detail/car-detail.component';
import { ComparisonComponent } from './features/comparison/comparison.component';
import { ComparisonService } from './core/services/comparison.service';
import { DetailService } from './core/services/detail.service';

@Component({
  imports: [CarBrowserComponent, CarDetailComponent, ComparisonComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly comparisonService = inject(ComparisonService);
  protected readonly detailService = inject(DetailService);
}

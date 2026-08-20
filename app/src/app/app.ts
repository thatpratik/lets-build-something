import { Component } from '@angular/core';

import { CarBrowserComponent } from './features/car-browser/car-browser.component';

@Component({
  imports: [CarBrowserComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}

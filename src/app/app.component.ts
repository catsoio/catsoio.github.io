import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VisitService } from './services/visit/visit.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, CommonModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'catsoio';

	constructor() {
		inject(VisitService).init();
	}
}

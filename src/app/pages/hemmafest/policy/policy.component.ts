import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-policy',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './policy.component.html',
	styleUrl: './policy.component.scss',
})
export class PolicyComponent {
	readonly lastUpdated = new Date(2025, 10, 15).toDateString();
}

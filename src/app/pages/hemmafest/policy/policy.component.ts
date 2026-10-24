import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-policy',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './policy.component.html',
	styleUrl: './policy.component.scss',
})
export class PolicyComponent {
	readonly lastUpdated = '24 oktober 2026';
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

type Mode = 'create' | 'join';

interface PartyDraft {
	name: string;
	date: string; // ISO datetime-local string
	place?: string;
	description?: string;
	public: boolean;
}

@Component({
	selector: 'app-hemmafest',
	standalone: true,
	imports: [RouterOutlet, CommonModule, ReactiveFormsModule, RouterLink],
	templateUrl: './hemmafest.component.html',
	styleUrl: './hemmafest.component.scss',
})
export class HemmafestComponent {
	readonly appStoreUrl = 'https://apps.apple.com/se/app/hemmafest/id6736556918?uo=2';

	features = [
		{
			title: 'Skapa eller joina på sekunder',
			body: 'Starta en fest med namn och tid, eller gå med i en fest nära dig.',
			icon: '⚡️',
		},
		{
			title: 'Synligt i närheten',
			body: 'Fester dyker upp för folk i området — perfekt för spontana häng.',
			icon: '📍',
		},
		{
			title: 'Integritet först',
			body: 'Ingen spårning. Inga annonser. Bara fest.',
			icon: '🛡️',
		},
	];

	faqs = [
		{
			q: 'Kostar appen något?',
			a: 'Nej, Hemmafest! är gratis att ladda ner och använda.',
		},
		{
			q: 'Behöver jag skapa konto?',
			a: 'Nej. Appen fungerar utan konto och utan personuppgiftsinsamling.',
		},
		{
			q: 'Vilken åldersgräns gäller?',
			a: '18+. Följ lokal lagstiftning och visa hänsyn till grannar.',
		},
	];
}

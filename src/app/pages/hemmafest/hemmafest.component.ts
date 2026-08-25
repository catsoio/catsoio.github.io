import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-hemmafest',
	standalone: true,
	imports: [RouterOutlet, CommonModule, RouterLink],
	templateUrl: './hemmafest.component.html',
	styleUrl: './hemmafest.component.scss',
})
export class HemmafestComponent {
	readonly appStoreUrl = 'https://apps.apple.com/se/app/hemmafest/id6736556918?uo=2';

	features = [
		{
			title: 'Swipa fram fester nära dig',
			body: 'Bläddra i flödet och hitta fester i närheten. Skicka en förfrågan för att gå med.',
			icon: '🔥',
		},
		{
			title: 'Skapa och styr din fest',
			body: 'Starta en fest, godkänn vilka som får komma och håll koll på gästerna.',
			icon: '🎉',
		},
		{
			title: 'Chatt, betyg och notiser',
			body: 'Prata med gänget i festchatten, betygsätt fester och få pushnotiser när det händer grejer.',
			icon: '💬',
		},
	];

	faqs = [
		{
			q: 'Behöver jag ett konto?',
			a: 'Ja. Du skapar ett konto för att kunna skapa fester, skicka förfrågningar och chatta.',
		},
		{
			q: 'Vad är Hemmafest+?',
			a: 'Hemmafest+ är vårt premium som låser upp mer, till exempel att se och nå fester i hela Sverige. Du kan använda appen gratis, men plus ger dig extra.',
		},
		{
			q: 'Vilken åldersgräns gäller?',
			a: '18+. Följ lokal lagstiftning och visa hänsyn till grannar.',
		},
		{
			q: 'Finns appen på Android?',
			a: 'Just nu är Hemmafest på iOS via App Store. Android är på gång.',
		},
	];
}

import { Component } from '@angular/core';

@Component({
	selector: 'app-vera-01-workspaces',
	imports: [],
	templateUrl: './vera-01-workspaces.html',
	styleUrl: './vera-01-workspaces.scss',
})
export class Vera01Workspaces {
	workflows: Workflow[] = [
		{
			id: 'analys',
			title: 'Utredningsanalys',
			shortDescription: 'Från tusentals sidor råmaterial till fullständig överblick.',
			iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', // 🆕
			savingsPercent: 15, // 🆕 — hur stor andel av manuell tid VERA tar (lägre = mer besparing)
			details: [
				'Kronologisk tidslinje och händelseförlopp',
				'Identifiering av motsägelser i förhör',
				'Sidhänvisningar direkt in i akten',
			],
			exampleInput: 'FUP / Ärendeakt (500+ sidor)',
			exampleOutput: 'Analysrapport & Tidslinje',
			timeBefore: '10–12 h',
			timeAfter: '45 min',
		},
		{
			id: 'process',
			title: 'Processföring',
			shortDescription: 'Strukturera din talan och bemöt motpartens argument.',
			iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', // 🆕
			savingsPercent: 15, // 🆕 — hur stor andel av manuell tid VERA tar (lägre = mer besparing)
			details: [
				'Bevismatriser med kompletteringsbehov',
				'Utkast till överklaganden och inlagor',
				'Huvudförhandlings-PM med frågelista',
			],
			exampleInput: 'Dom/Beslut & Bevisning',
			exampleOutput: 'Processutkast & Bevismatris',
			timeBefore: '8 h',
			timeAfter: '1 h',
		},
		{
			id: 'administration',
			title: 'Klient & Granskning',
			shortDescription: 'Automatisera det tidskrävande efterarbetet.',
			iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', // 🆕
			savingsPercent: 15, // 🆕 — hur stor andel av manuell tid VERA tar (lägre = mer besparing)
			details: [
				'Klientbrev på begriplig svenska',
				'Automatisk anonymisering (GDPR)',
				'Sammanfattningar för snabb brief',
			],
			exampleInput: 'Juridiska dokument / Domar',
			exampleOutput: 'Klientbrev & Maskerad kopia',
			timeBefore: '3 h',
			timeAfter: '10 min',
		},
	];
}

import { Component } from '@angular/core';

interface Feature {
	title: string;
	description: string;
	imageUrl: string;
}

@Component({
	selector: 'app-why-local-agent',
	standalone: true,
	imports: [],
	templateUrl: './why-local-agent.component.html',
	styleUrl: './why-local-agent.component.scss',
})
export class WhyLocalAgentComponent {
	public features: Feature[] = [
		{
			title: 'GDPR-säkrad',
			imageUrl: 'assets/imgs/gdpr.png',
			description: 'All data stannar hos er. Inga externa molntjänster.',
		},
		{
			title: 'Spårbar juridik',
			imageUrl: 'assets/imgs/books.jpg',

			description:
				'Källhänvisningar till svenska rättskällor (lagrum, praxis, kapitel/paragrafer).',
		},
		{
			title: 'Djupare insikter',
			imageUrl: 'assets/imgs/riskdetect.png',

			description:
				'Flaggar avvikelser, otydliga klausuler och dolda risker innan de blir dyra problem.',
		},
		{
			title: 'Mer debiterbar tid',
			imageUrl: 'assets/imgs/timeismoney.jpg',

			description:
				'Automatisera repetitiva arbetet: lägg mer tid på kvalificerad rådgivning.',
		},
		{
			title: 'Alltid tillgänglig',
			imageUrl: 'assets/imgs/nocloud.png',
			description:
				'Fungerar även utan internet. Låg latens och noll molnberoenden.',
		},
		{
			imageUrl: 'assets/imgs/fast.jpg',
			title: 'Från timmar till minuter',
			description:
				'Få en omedelbar överblick och en komplett sammanfattning på rekordtid.',
		},
	];
}

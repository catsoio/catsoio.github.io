import { Component } from '@angular/core';

type FaqItem = { q: string; a: string };

@Component({
	selector: 'app-faq',
	standalone: true,
	imports: [],
	templateUrl: './faq.component.html',
	styleUrl: './faq.component.scss',
})
export class FaqComponent {
	introTitle = 'Vanliga Frågor.';
	introText = '';

	highlights: string[] = [];

	faqs: FaqItem[] = [
		{
			q: 'Lämnar datan vår miljö?',
			a: 'Nej.',
		},
		{
			q: 'Hur fungerar källhänvisningar?',
			a: 'Varje svar länkar direkt till relevant kapitel, paragraf och praxis från svenska rättskällor.',
		},
		{
			q: 'Kan vi skräddarsy vilka expertområden vi vill ha tillgång till?',
			a: 'Absolut! Ni väljer precis vilka expertområden som är relevanta för er byrå och sätter ihop ett paket som passar er.',
		},
		{
			q: 'Vilka expertområden får vi?',
			a: 'Rekommenderas för relevant användning. Vi levererar en DPIA-mall och stöd för retention, roller och riskåtgärder.',
		},
		{
			q: 'Får alla på byrån tillgång till VERA-01?',
			a: 'Ja. Ett firmakonto kan omfatta hela byrån. Ni kan styra roller och behörigheter per team, klient och ärende.',
		},
	];
}

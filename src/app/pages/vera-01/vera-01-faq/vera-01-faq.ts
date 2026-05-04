import { Component, signal } from '@angular/core';

@Component({
	selector: 'app-vera-01-faq',
	imports: [],
	templateUrl: './vera-01-faq.html',
	styleUrl: './vera-01-faq.scss',
})
export class Vera01Faq {
	openFaqIndex = signal<number | null>(null);

	faqItems: FaqItem[] = [
		{
			question: 'Lämnar någon klientdata byrån?',
			answer: 'Nej. VERA-01 körs lokalt på byråns hårdvara — ingen data lämnar nätverket.',
		},
		{
			question: 'Är detta förenligt med Advokatsamfundets vägledning?',
			answer:
				'Ja. VERA-01 är byggd kring VRGA 2.2, GDPR och Advokatsamfundets AI-vägledning (2025).',
		},
		{
			question: 'Ersätter VERA-01 advokaten?',
			answer:
				'Nej. VERA-01 producerar utkast och underlag — ombudet granskar, justerar och tar ansvar.',
		},
		{
			question: 'Hur fungerar källhänvisningar?',
			answer:
				'Varje juridiskt påstående länkas till lagrum, förarbeten eller praxis. Källorna visas inline och kan verifieras direkt i utkastet.',
		},
		{
			question: 'Vad händer om internet ligger nere?',
			answer: 'Inget. VERA-01 fungerar fullt offline — all bearbetning sker lokalt.',
		},
	];

	toggleFaq(index: number) {
		this.openFaqIndex.set(this.openFaqIndex() === index ? null : index);
	}
}

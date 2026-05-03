// vera-landing.component.ts
import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vera01hero } from '../../vera01hero/vera01hero';

interface Workflow {
	id: string;
	title: string;
	shortDescription: string;
	iconPath: string;
	savingsPercent: number;
	details: string[];
	exampleInput: string;
	exampleOutput: string;
	timeBefore: string;
	timeAfter: string;
}

interface Playbook {
	area: string;
	icon: string;
	description: string;
}

interface FaqItem {
	question: string;
	answer: string;
}

@Component({
	selector: 'app-vera-01-landing',
	imports: [CommonModule, Vera01hero],
	templateUrl: './vera-01-landing.html',
	styleUrl: './vera-01-landing.scss',
})
export class VeraLandingComponent {
	tags: string[] = ['VRGA 2.2 — Sekretess', 'GDPR Art. 32 — Säkerhet'];

	activeWorkflowId = signal<string | null>('beslut-overklagande');
	openFaqIndex = signal<number | null>(null);
	scrolled = signal(false);
	mobileMenuOpen = signal(false);

	activeWorkflow = computed(() => this.workflows.find((w) => w.id === this.activeWorkflowId())!);
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

	aiComparison = [
		{
			title: 'Datasekretess & GDPR',
			description: 'Var processas och lagras egentligen informationen?',
			chatgpt: 'Datan skickas ofta till servrar utanför EU (USA).',
			vera: '100% GDPR-säker. Svenska servrar eller helt offline hos er.',
		},
		{
			title: 'Modellträning & Klientdata',
			description: 'Används er inmatade data för att göra AI:n smartare?',
			chatgpt: 'Stor risk att känslig data används som träningsdata.',
			vera: 'Stängd miljö (Zero Data Retention). Er data tränar aldrig modellen.',
		},
		{
			title: 'Juridisk precision',
			description: 'Förståelse för lagrum och domstolars praxis.',
			chatgpt: 'Generell modell. Hög risk för hallucinerade (ofta amerikanska) lagrum.',
			vera: 'Specialtränad för svensk rättspraxis och juridiskt metodarbete.',
		},
		{
			title: 'Kapacitet (Kontextfönster)',
			description: 'Förmågan att läsa in stora FUP:ar och akter på en gång.',
			chatgpt: 'Tappar tråden eller kraschar vid hundratals sidor.',
			vera: 'Skräddarsydd för massiv dokumenthantering. Klarar tusentals sidor i en inläsning.',
		},
		{
			title: 'Källhänvisningar',
			description: 'Kan du lita på att AI:ns påståenden stämmer?',
			chatgpt: 'Hittar ofta på sidnummer som inte existerar.',
			vera: 'Genererar exakta, klickbara sidhänvisningar direkt in i originalakten.',
		},
	];

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

	@HostListener('window:scroll')
	onScroll() {
		this.scrolled.set(window.scrollY > 32);
	}

	setActiveWorkflow(id: string) {
		this.activeWorkflowId.set(id);
	}

	toggleFaq(index: number) {
		this.openFaqIndex.set(this.openFaqIndex() === index ? null : index);
	}

	toggleMobileMenu() {
		this.mobileMenuOpen.set(!this.mobileMenuOpen());
	}

	scrollTo(id: string, event: Event) {
		event.preventDefault();
		this.mobileMenuOpen.set(false);
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	toggleWorkflow(id: string) {
		this.activeWorkflowId.update((current) => (current === id ? null : id));
	}
}

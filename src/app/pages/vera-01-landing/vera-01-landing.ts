// vera-landing.component.ts
import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Workflow {
	id: string;
	title: string;
	shortDescription: string;
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
	imports: [CommonModule],
	templateUrl: './vera-01-landing.html',
	styleUrl: './vera-01-landing.scss',
})
export class VeraLandingComponent {
	tags: string[] = ['Sammanfattar', 'Angriper', 'Överkalgar', 'Analyserar'];

	activeWorkflowId = signal<string>('beslut-overklagande');
	openFaqIndex = signal<number | null>(null);
	scrolled = signal(false);
	mobileMenuOpen = signal(false);

	activeWorkflow = computed(() => this.workflows.find((w) => w.id === this.activeWorkflowId())!);
	workflows: Workflow[] = [
		{
			id: 'fup-analys',
			title: 'Förundersökningsprotokoll',
			shortDescription:
				'Bryter ner stora FUP på hundratals sidor till strukturerad processöversikt.',
			details: [
				'Sammanfattar varje förhör med sidhänvisning',
				'Bygger kronologisk tidslinje ur hela akten',
				'Flaggar motsägelser mellan förhörspersoner',
				'Identifierar luckor i utredningen',
			],
			exampleInput: 'FUP, 430 sidor',
			exampleOutput: 'Förhörssammanfattningar, tidslinje, motsägelserapport',
			timeBefore: '8–12 h',
			timeAfter: '30 min',
		},
		{
			id: 'forhor-motsagelser',
			title: 'Förhörsanalys',
			shortDescription: 'Jämför förhörsutskrifter mot varandra och mot dokumentbevisning.',
			details: [
				'Korsrefererar vittnesmål sinsemellan',
				'Hittar interna motsägelser i partsutsagor',
				'Kontrollerar uppgifter mot kontoutdrag, journaler och övrig bevisning',
				'Rapport med exakta sidhänvisningar',
			],
			exampleInput: 'Sju förhörsutskrifter, kontoutdrag, lönespecifikationer',
			exampleOutput: 'Motsägelserapport med citat och sidreferenser',
			timeBefore: '4–6 h',
			timeAfter: '20 min',
		},
		{
			id: 'beslut-overklagande',
			title: 'Beslut till överklagande',
			shortDescription: 'Myndighetsbeslut blir strukturerat processutkast med källhänvisningar.',
			details: [
				'Sammanfattning anpassad för ombud',
				'Identifierar angreppspunkter och svaga led i myndighetens resonemang',
				'Bevismatris och kompletteringsbehov',
				'Utkast med yrkanden, grunder och utveckling av talan',
			],
			exampleInput: 'Myndighetsbeslut, 134 sidor',
			exampleOutput: 'Överklagandeutkast, sammanfattning, bevismatris',
			timeBefore: '6–8 h',
			timeAfter: '45 min',
		},
		{
			id: 'bevismatris',
			title: 'Bevismatris',
			shortDescription: 'Korsrefererar dokument mot motpartens påståenden.',
			details: [
				'Varje påstående kopplat till tillhörande bevisning',
				'Identifierar saknad bevisning',
				'Föreslår motbevisning ur befintligt material',
				'Prioriterar efter processuell betydelse',
			],
			exampleInput: 'Ärendeakt med kontoutdrag, lönespecifikationer, inlagor',
			exampleOutput: 'Bevismatris med kompletteringslista',
			timeBefore: '5 h',
			timeAfter: '30 min',
		},
		{
			id: 'forhandling',
			title: 'Förhandlingsförberedelse',
			shortDescription: 'Bygger frågor, motargument och pläderingsutkast ur ärendeakten.',
			details: [
				'Frågor till motpart och vittnen baserade på aktmaterialet',
				'Sannolika motangrepp och förslag på bemötande',
				'Strategisk argumentationsordning',
				'Pläderingsutkast',
			],
			exampleInput: 'Ärendeakt och processhistorik',
			exampleOutput: 'Huvudförhandlings-PM',
			timeBefore: '8 h',
			timeAfter: '1 h',
		},
		{
			id: 'klientbrev',
			title: 'Klientbrev',
			shortDescription: 'Översätter domskäl och beslut till begriplig svenska.',
			details: [
				'Förenklar utan att förvanska det juridiska innehållet',
				'Förklarar nästa steg och tidsfrister',
				'Lyfter fram klientens handlingsalternativ',
				'Anpassas efter byråns tonalitet',
			],
			exampleInput: 'Tingsrättsdom, 40 sidor',
			exampleOutput: 'Klientbrev på en A4',
			timeBefore: '1 h 30 min',
			timeAfter: '5 min',
		},
		{
			id: 'redaction',
			title: 'Anonymisering',
			shortDescription: 'Maskerar personuppgifter inför extern delning eller publicering.',
			details: [
				'Identifierar och maskerar personnummer, namn och adresser',
				'Ersätter med initialer eller pseudonymer',
				'Bevarar dokumentets struktur och argumentation',
				'Ändringslogg för granskning',
			],
			exampleInput: 'Originalhandling med personuppgifter',
			exampleOutput: 'Anonymiserad version med ändringslogg',
			timeBefore: '2 h',
			timeAfter: '3 min',
		},
	];

	timeSavings = [
		{ task: 'Analysera FUP på ~500 sidor', before: '8–12 h', after: '10 min', saved: '~10 h' },
		{ task: 'Motsägelseanalys av förhör', before: '4–6 h', after: '10 min', saved: '~5 h' },
		{ task: 'Överklagande från myndighetsbeslut', before: '6–8 h', after: '10 min', saved: '~6 h' },
		{ task: 'Bevismatris ur ärendeakt', before: '5 h', after: '10 min', saved: '~4 h 30 min' },
		{ task: 'Förhandlings-PM inför huvudförhandling', before: '8 h', after: '30 min', saved: '~7 h' },
		{
			task: 'Klientbrev från komplext domskäl',
			before: '1 h 30 min',
			after: '5 min',
			saved: '~1 h 25 min',
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
}

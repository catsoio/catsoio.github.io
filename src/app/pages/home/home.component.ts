import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	NgZone,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	QueryList,
	ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Card = {
	id: string;
	title: string;
	desc: string;
	icon: string;
	details: string[];
};

type NavLink = {
	label: string;
	href: string;
};

type Stat = {
	value: string;
	label: string;
};

type Feature = {
	title: string;
	desc: string;
};

type RobotCapability = {
	title: string;
	desc: string;
};

type RoadmapItem = {
	phase: string;
	title: string;
	items: string[];
	status: 'done' | 'active' | 'upcoming';
};

type Testimonial = {
	initials: string;
	quote: string;
	name: string;
	role: string;
	stars: number;
};

type FAQ = {
	q: string;
	a: string;
};

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
	currentYear = new Date().getFullYear();
	mobileMenuOpen = false;
	showScrollIndicator = true;

	constructor(
		private cdr: ChangeDetectorRef,
		private zone: NgZone,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	private scrollHandler = () => {
		const show = window.scrollY <= 50;
		if (show !== this.showScrollIndicator) {
			this.zone.run(() => {
				this.showScrollIndicator = show;
				this.cdr.markForCheck();
			});
		}
	};

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			window.addEventListener('scroll', this.scrollHandler, { passive: true });
		}
	}

	ngOnDestroy() {
		if (isPlatformBrowser(this.platformId)) {
			window.removeEventListener('scroll', this.scrollHandler);
		}
	}

	navLinks: NavLink[] = [
		{ label: 'Produkter', href: '#products' },
		{ label: 'AI-agenter', href: '#agents' },
		{ label: 'Robotik', href: '#robotics' },
		{ label: 'Kontakt', href: '#contact' },
	];

	scrollTo(event: Event, fragment: string) {
		event.preventDefault();
		this.mobileMenuOpen = false;
		const id = fragment.replace('#', '');
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	stats: Stat[] = [
		{ value: '3', label: 'Produkter i drift' },
		{ value: '100%', label: 'Svensk data i Sverige' },
		{ value: '<200ms', label: 'Svarstid lokalt' },
		{ value: 'GDPR', label: 'Compliant från grunden' },
	];

	logos: string[] = [];

	tabs = [
		{
			id: 'ai-agents',
			label: 'AI-agenter',
		},
		{
			id: 'robotics',
			label: 'Robotik',
		},
		{
			id: 'digital-twin',
			label: 'Digital tvilling',
		},
	];

	active = 0;

	@ViewChildren('tabBtn') tabBtns!: QueryList<ElementRef<HTMLButtonElement>>;

	select(i: number) {
		this.active = i;
	}

	onKeydown(evt: KeyboardEvent, i: number) {
		const max = this.tabs.length - 1;
		switch (evt.key) {
			case 'ArrowRight':
				this.active = i === max ? 0 : i + 1;
				this.focusActive();
				evt.preventDefault();
				break;
			case 'ArrowLeft':
				this.active = i === 0 ? max : i - 1;
				this.focusActive();
				evt.preventDefault();
				break;
			case 'Home':
				this.active = 0;
				this.focusActive();
				evt.preventDefault();
				break;
			case 'End':
				this.active = max;
				this.focusActive();
				evt.preventDefault();
				break;
		}
	}

	private focusActive() {
		queueMicrotask(() => this.tabBtns.get(this.active)?.nativeElement?.focus());
	}

	features: Feature[] = [
		{
			title: 'Virtuella AI-agenter',
			desc: 'Skräddarsydda agenter för juridik, vård, handel och industri — tränade på svensk data med full spårbarhet.',
		},
		{
			title: 'Fysisk AI & robotik',
			desc: 'Från digital tvilling till verklighet. Sim-to-Real-pipeline med NVIDIA Isaac Sim för lager och produktion.',
		},
		{
			title: 'Säkerhet & compliance',
			desc: 'GDPR-säkrad drift. On-prem eller svensk molnregion. Full loggning och spårbarhet i varje steg.',
		},
		{
			title: 'Lokal inferens',
			desc: 'Kör LLM:er lokalt utan molnberoende. Låg latens, hög säkerhet, alltid tillgänglig.',
		},
		{
			title: 'Integration & API',
			desc: 'Sömlös koppling till era befintliga system — ERP, CRM, journal, ärendehantering och mer.',
		},
		{
			title: 'Flerspråksstöd',
			desc: 'Svenska som förstaspråk med stöd för engelska och fler språk vid behov.',
		},
	];

	robotCapabilities: RobotCapability[] = [
		{
			title: 'Digital tvilling',
			desc: 'Bygg en exakt digital kopia av er anläggning. Testa och optimera innan ni rullar ut i verkligheten.',
		},
		{
			title: 'Sim-to-Real',
			desc: 'Träna robotar i simulering och överför direkt till fysisk hårdvara med minimalt gap.',
		},
		{
			title: 'Fleet orchestration',
			desc: 'Orkestrera hundratals autonoma enheter i realtid — AMR, robotarmar, humanoids.',
		},
		{
			title: 'Safety layer',
			desc: 'EU AI-Act-redo säkerhetslager med kontinuerlig övervakning och automatiska nödstopp.',
		},
	];

	robotChips = [
		'NVIDIA Isaac Sim',
		'Omniverse',
		'Digital tvilling',
		'Sim→Real',
		'Fleet intelligence',
		'OTA-uppdateringar',
		'Sensor simulation',
		'Safety layer',
	];

	cards: Card[] = [
		{
			id: 'public',
			title: 'Offentlig sektor',
			desc: 'AI-agenter som effektiviserar e-tjänster, handläggning och kommunikation — med full efterlevnad.',
			icon: 'Building',
			details: [
				'Automatiserad handläggning & e-tjänster',
				'GDPR- & offentlighetsanpassade arbetsflöden',
				'Integration med diariesystem',
				'Språkstöd svenska/engelska',
				'Säker drift: on-prem eller svensk molnregion',
			],
		},
		{
			id: 'legal',
			title: 'Advokatbyråer & juridik',
			desc: 'Säkra, spårbara arbetsflöden för granskning, research och dokumentproduktion.',
			icon: 'Scale',
			details: [
				'Dokumentanalys & due diligence',
				'Mallgenerering & aktbilagor',
				'Sekretess-/etik-kontroller',
				'Rättsdatabas-sök med citat & referenser',
				'Klientportal & tidsregistrering',
			],
		},
		{
			id: 'healthcare',
			title: 'Hälso- & sjukvård',
			desc: 'Beslutsstöd nära vårdflöden — designat för PDL och högsta säkerhet.',
			icon: 'Stethoscope',
			details: [
				'Journal-sammanfattningar & triage',
				'ICD-/KVÅ-förslag (assisterat)',
				'Säkra diktat-/OCR-flöden',
				'HL7/FHIR-integrationer',
				'Drift enligt patientdatalagen',
			],
		},
		{
			id: 'manufacturing',
			title: 'Industri & tillverkning',
			desc: 'Operativ co-pilot för produktion, kvalitet och säkerhet — direkt i linans system.',
			icon: 'Factory',
			details: [
				'SOP-assistans & felsökning',
				'Prediktivt underhåll',
				'Ritnings-/CAD-OCR till åtgärdslistor',
				'EHS/ISO-efterlevnadsguider',
				'Skiftöverlämning & kunskapsgraf',
			],
		},
		{
			id: 'retail',
			title: 'Handel & e-handel',
			desc: 'Personliga upplevelser och smart kundtjänst som lyfter konvertering och NPS.',
			icon: 'ShoppingCart',
			details: [
				'Produkttexter & översättningar',
				'Kundtjänst-agent med orderstatus',
				'Prishistorik & kampanjsammanfattning',
				'PIM/ERP/CRM-integrationer',
				'Rådgivning i realtid',
			],
		},
		{
			id: 'realestate',
			title: 'Fastighet & bygg',
			desc: 'Från anbud och AMA till besiktning — styrt av spårbarhet och standarder.',
			icon: 'House',
			details: [
				'Anbuds- & AF-utkast',
				'Ritnings-/AMA-tolkning',
				'ÄTA-/ändringshantering',
				'Besiktningsprotokoll via foto/OCR',
				'Byggdagbok & arbetsmiljöstöd',
			],
		},
	];

	selectedCard: Card = this.cards[0];

	selectCard(card: Card) {
		this.selectedCard = card;
	}

	trackById = (_: number, item: Card) => item.id;

	roadmap: RoadmapItem[] = [
		{
			phase: 'Fas 1',
			title: 'Virtuella agenter',
			items: ['VERA-01 för advokatbyråer', 'Lokala LLM-pipelines', 'API & integrationsramverk'],
			status: 'done',
		},
		{
			phase: 'Fas 2',
			title: 'Branschexpansion',
			items: [
				'Agenter för vård, offentlig sektor & handel',
				'Multi-agent orkestrering',
				'Enterprise-grade säkerhet',
			],
			status: 'active',
		},
		{
			phase: 'Fas 3',
			title: 'Fysisk AI & robotik',
			items: [
				'Digital tvilling-pipeline',
				'Sim-to-Real med NVIDIA Isaac',
				'Fleet orchestration för lager & industri',
			],
			status: 'upcoming',
		},
	];

	testimonials: Testimonial[] = [];

	faqs: FAQ[] = [
		{
			q: 'Vad är Catso?',
			a: 'Catso är ett svenskt tech-bolag som bygger AI-agenter och robotiklösningar. Vi driver produkter som VERA-01 (juridisk AI), Hemmafest (event-app) och Poängjakten (studentplattform).',
		},
		{
			q: 'Vad är VERA-01?',
			a: 'VERA-01 är vår AI-agent byggd specifikt för svenska advokatbyråer. Den analyserar ärenden, genererar utkast och hänvisar till svenska rättskällor — utan att data lämnar er miljö.',
		},
		{
			q: 'Vad är Hemmafest?',
			a: 'Hemmafest är en app där du snabbt kan skapa eller hitta fester. Bjud in vänner, sätt datum och kör. Tillgänglig på webben och mobil.',
		},
		{
			q: 'Vad är Poängjakten?',
			a: 'Poängjakten är en plattform där gymnasieelever tävlar om att skapa innehåll åt partnerföretag. Företag når studenter där de faktiskt är.',
		},
		{
			q: 'Lämnar vår data Sverige?',
			a: 'Nej. All drift sker lokalt eller i svensk molnregion. Vi använder inga externa tjänster som skickar data utanför Sverige.',
		},
		{
			q: 'Kan vi boka en demo?',
			a: 'Självklart. Mejla support@catso.io eller använd kontaktformuläret så bokar vi en tid.',
		},
	];

	expandedFaq: number | null = null;

	toggleFaq(index: number) {
		this.expandedFaq = this.expandedFaq === index ? null : index;
	}

	toggleMobileMenu() {
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}
}

import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	QueryList,
	ViewChildren,
} from '@angular/core';
import {
	LucideAngularModule,
	Camera,
	Zap,
	Sparkles,
	Shield,
	Monitor,
	Layers,
	ChevronRight,
	Star,
	Play,
	ArrowRight,
	Wand2,
	Scissors,
	Share2,
	Cloud,
	Check,
	ArrowDown,
	Phone,
	Contact,
	User,
	BrainCircuit,
	Drill,
	icons,
	Handshake,
	Calendar,
	Route,
	FileText,
	PiggyBank,
	Rocket,
} from 'lucide-angular';

type Card = {
	id: string;
	title: string;
	desc: string;
	icon: keyof typeof icons;
	details: string[];
};

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, LucideAngularModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	yearly = true;

	logos = ['Acme', 'Nova', 'Placid', 'Helix', 'Nimbus', 'Atlas'];

	faqs = [
		{
			q: 'Does CaptureKit work on Windows?',
			a: 'Today we focus on macOS for the best native experience. Windows is on our roadmap—join the waitlist to get notified.',
		},
		{
			q: 'Is there a free trial?',
			a: 'Yes. Start free, then upgrade anytime. You can cancel with a click.',
		},
		{
			q: 'Where are my files stored?',
			a: 'By default, everything is local. If you enable cloud upload, links are private by default and you control retention.',
		},
		{
			q: 'Do you offer team discounts?',
			a: 'Yes—volume discounts start at 10 seats. Contact us for details.',
		},
	];

	get price() {
		return {
			free: '0',
			pro: this.yearly ? '$8' : '$10',
			teams: this.yearly ? '$12' : '$15',
		};
	}

	currentYear = new Date().getFullYear();

	icons = icons;
	readonly Camera = Camera;
	readonly Zap = Zap;
	readonly Sparkles = Sparkles;
	readonly Shield = Shield;
	readonly Monitor = Monitor;
	readonly Layers = Layers;
	readonly ChevronRight = ChevronRight;
	readonly Star = Star;
	readonly Phone = Phone;
	readonly Contact = Contact;
	readonly Play = Play;
	readonly ArrowRight = ArrowRight;
	readonly Wand2 = Wand2;
	readonly Scissors = Scissors;
	readonly Share2 = Share2;
	readonly Cloud = Cloud;
	readonly check = Check;
	readonly arrow = ArrowDown;
	readonly User = User;
	readonly BrainCircuit = BrainCircuit;
	readonly drill = Drill;
	readonly Route = Route;
	readonly Check = Check;
	readonly Handshake = Handshake;
	readonly Calendar = Calendar;
	readonly FileText = FileText;
	readonly PiggyBank = PiggyBank;
	readonly Rocket = Rocket;

	tabs = [
		{
			id: 'AI-agents',
			label: 'AI-agenter',
			filename: 'agent.ai',
			icon: this.BrainCircuit,
		},
		{
			id: 'annotate',
			label: 'Annotate',
			filename: 'annotate-demo.png',
			icon: this.Wand2,
		},
		{
			id: 'robots',
			label: 'Robotik',
			filename: 'share-demo.png',
			icon: this.Share2,
		},
		{
			id: 'robots',
			label: 'Robotik',
			filename: 'share-demo.png',
			icon: this.drill,
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

	cards: Card[] = [
		{
			id: 'public',
			title: 'Offentlig sektor',
			desc: 'AI-agenter som effektiviserar e-tjänster, handläggning och kommunikation - med full efterlevnad.',
			icon: 'Building',
			details: [
				'Automatiserad handläggning & e-tjänster',
				'GDPR- & offentlighetsanpassade arbetsflöden',
				'Integration med diarieföring/ärendehantering',
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
				'Dokumentanalys & due diligence med källhänvisningar',
				'Mallgenerering & aktbilagor',
				'Sekretess-/etik-kontroller och full loggning',
				'Rättsdatabas-sök med citat & referenser',
				'Klientportal & tidsregistrering (integrationsklar)',
			],
		},
		{
			id: 'healthcare',
			title: 'Hälso- & sjukvård',
			desc: 'Beslutsstöd nära vårdflöden - designat för PDL och högsta säkerhet.',
			icon: 'Stethoscope',
			details: [
				'Journal-sammanfattningar & triage-stöd',
				'ICD-/KVÅ-förslag (assisterat)',
				'Säkra diktat-/OCR-flöden',
				'HL7/FHIR-integrationer',
				'Drift i enlighet med patientdatalagen',
			],
		},
		{
			id: 'manufacturing',
			title: 'Industri & tillverkning',
			desc: 'Operativ co-pilot för produktion, kvalitet och säkerhet - direkt i linans system.',
			icon: 'Factory',
			details: [
				'SOP-assistans & felsökning',
				'Prediktivt underhåll (datakopplingar)',
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
				'Produkttexter & översättningar i skala',
				'Kundtjänst-agent med orderstatus/returer',
				'Prishistorik & kampanjsammanfattning',
				'PIM/ERP/CRM-integrationer',
				'Rådgivning i realtid online',
			],
		},
		{
			id: 'realestate',
			title: 'Fastighet & bygg',
			desc: 'Från anbud och AMA till besiktning - styrt av spårbarhet och standarder.',
			icon: 'House',
			details: [
				'Anbuds- & AF-utkast',
				'Ritnings-/AMA-tolkning till checklistor',
				'ÄTA-/ändringshantering med spårbarhet',
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
}

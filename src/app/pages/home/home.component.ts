import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	NgZone,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';

type NavLink = {
	label: string;
	href: string;
};

type FAQ = {
	q: string;
	a: string;
};

type Sector = {
	title: string;
	desc: string;
	tags: string[];
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
		{ label: 'Robotik', href: '#robotics' },
		{ label: 'Kontakt', href: '#contact' },
	];

	scrollTo(event: Event, fragment: string) {
		if (!fragment.startsWith('#')) return;
		event.preventDefault();
		this.mobileMenuOpen = false;
		const id = fragment.replace('#', '');
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	sectors: Sector[] = [
		{
			title: 'Offentlig sektor',
			desc: 'Kommuner, myndigheter och regioner som vill automatisera handläggning, e-tjänster och intern kommunikation utan att data lämnar den egna miljön.',
			tags: ['GDPR', 'On-prem', 'Svenska datakällor'],
		},
		{
			title: 'Advokatbyråer',
			desc: 'VERA-01 är vår första agent, byggd för svenska advokatbyråer. Ärendeanalys, dokumentgenerering och sökning i rättskällor — tränad på svensk lag.',
			tags: ['VERA-01', 'Lokalt', 'Rättskällor'],
		},
		{
			title: 'Industri',
			desc: 'Lager, gruvor och produktionsanläggningar som vill ha autonoma robotar i drift. Vi tar projektet från digital tvilling till faktisk produktion.',
			tags: ['Digital tvilling', 'Sim-to-Real', 'Fleet'],
		},
	];

	faqs: FAQ[] = [
		{
			q: 'Vad är Catso AI & Robotics?',
			a: 'Vi bygger AI-agenter, appar för e-handel och robotiklösningar för svenska företag och myndigheter. VERA-01 är vår AI-agent för advokatbyråer och Catso AI Sök är vår Shopify-app.',
		},
		{
			q: 'Vad är VERA-01?',
			a: 'En AI-agent byggd specifikt för svenska advokatbyråer. Den körs lokalt hos er, analyserar ärenden, genererar utkast och söker i svenska rättskällor. Ingen data skickas till externa tjänster.',
		},
		{
			q: 'Bygger ni appar för Shopify?',
			a: 'Ja, vi är officiell Shopify-partner. Catso AI Sök är vår första app — en sökruta som tolkar kundens fråga och visar produkter som finns i lager. Den installeras direkt i butiken utan ändringar i temat.',
		},
		{
			q: 'Vad kostar det?',
			a: 'Det beror på produkt, verksamhet och volym. Mejla oss på support@catso.io så pratar vi.',
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

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
import { Faq as FAQ, HOME_FAQ } from '../../seo/faq.data';

type NavLink = {
	label: string;
	href: string;
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
		{ label: 'Catso Verkstad', href: '/apps/verkstad' },
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
			title: 'Däck- och bilverkstäder',
			desc: 'Catso Verkstad samlar lager, däckhotell, bokningar och arbetsorder i ett system, så du slipper leta i pärmar och skriva samma sak flera gånger.',
			tags: ['Däckhotell', 'Arbetsorder', 'Lager'],
		},
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

	faqs: FAQ[] = HOME_FAQ;

	expandedFaq: number | null = null;

	toggleFaq(index: number) {
		this.expandedFaq = this.expandedFaq === index ? null : index;
	}

	toggleMobileMenu() {
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}
}

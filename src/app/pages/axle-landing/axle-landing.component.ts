import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	inject,
	isDevMode,
	signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MODULER } from '../axle-modul/axle-moduler.data';
import { firstValueFrom } from 'rxjs';
import { AXLE_FAQ } from '../../seo/faq.data';

interface Feature {
	id: string;
	title: string;
	text: string;
	points: string[];
	image: string;
	alt: string;
	phone?: string;
	phoneAlt?: string;
	/** Sidan med mer om delen: /axle/<to>. */
	to?: string;
	more?: string;
}

interface Plan {
	name: string;
	price: string;
	users: string;
	blurb: string;
	features: string[];
	highlight?: boolean;
}

interface Catalog {
	extraUserPriceMinor: number;
	plans: { id: string; name: string; blurb: string; features: string[]; priceMinor: number; includedUsers: number }[];
}

type FormState = 'idle' | 'sending' | 'sent' | 'error';

const MANUAL = '/assets/imgs/manual';
const PHOTO = '/assets/imgs/axle';

/** Produktnamnet står på ett ställe så det är lätt att byta. */
export const PRODUCT_NAME = 'Catso Axle';

@Component({
	selector: 'app-axle-landing',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterLink, ReactiveFormsModule],
	templateUrl: './axle-landing.component.html',
	styleUrl: './axle-landing.component.scss',
})
export class AxleLandingComponent implements OnInit, AfterViewInit, OnDestroy {
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private cleanup?: () => void;
	private readonly http = inject(HttpClient);
	private readonly fb = inject(FormBuilder);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

	readonly product = PRODUCT_NAME;
	readonly moduler = MODULER;
	readonly manual = MANUAL;
	readonly photo = PHOTO;
	/** Länk till själva appen. Tom tills adressen är bestämd, då döljs "Logga in". */
	readonly appUrl = '';
	readonly currentYear = new Date().getFullYear();
	readonly menuOpen = signal(false);

	readonly faqs = AXLE_FAQ;

	readonly features: Feature[] = [

		{
			id: 'dackhotell',
			title: 'Däckhotell',
			text: 'Varje set har regnummer, hylla och avgift. Översikten visar vilka som ska hämtas vecka för vecka, vilka hyllor som är fulla och vilka kunder som har under 4 mm kvar, så du vet vem du ska ringa om nya däck.',
			points: ['Etikett att sätta på setet', 'Obetalda avgifter och försenade hämtningar'],
			image: `${PHOTO}/app-hotellov.jpg`,
			alt: 'Översikten för däckhotellet med hämtningar per vecka, hyllor och mönsterdjup',
			to: 'dackhotell',
			more: 'Mer om däckhotellet',
		},
		{
			id: 'kalla-in',
			title: 'Kalla in med SMS',
			text: 'Inför bytet skickar du ett SMS till alla som har däck hos dig. Namn och regnummer fylls i för varje kund, och de som redan fått ett SMS är inte förvalda.',
			points: [],
			image: `${PHOTO}/app-kallain.jpg`,
			alt: 'Dialogen Kalla in kunder med SMS-text och mottagare',
		},		{
			id: 'tidsbokning',
			title: 'Tidsbokning',
			text: 'En kolumn per mekaniker och lyft. Klicka i en ledig tid för att boka. Är kunden ny räcker telefonnumret, namnet fyller du i sen.',
			points: ['Bokningen blir en arbetsorder när bilen kommer'],
			image: `${PHOTO}/app-resurser.jpg`,
			alt: 'Tidsbokningen med en kolumn per mekaniker och lyft',
			to: 'tidsbokning',
			more: 'Mer om tidsbokningen',
		},
		{
			id: 'offert',
			title: 'Offert som kunden godkänner i mobilen',
			text: 'Skicka offerten som SMS eller mejl. Kunden öppnar en länk, ser vad som ingår och trycker Godkänn. Du ser när kunden öppnat den, och en godkänd offert blir en arbetsorder.',
			points: [],
			image: `${PHOTO}/app-offert.jpg`,
			alt: 'Offerten med status Väntar på svar och när kunden öppnade länken',
			phone: `${PHOTO}/app-kundsida.jpg`,
			phoneAlt: 'Kundens sida i mobilen med knappen Godkänn',
			to: 'offert',
			more: 'Mer om offerten',
		},
		{
			id: 'lager',
			title: 'Lager',
			text: 'Däck per fälgstorlek och säsong, märken, lagervärde och vad som ska beställas. Däckens ålder räknas fram från DOT-koden, så de äldsta säljs först.',
			points: ['Sök på dimension, märke eller artikelnummer'],
			image: `${PHOTO}/app-lagerov.jpg`,
			alt: 'Översikten för lagret med däck per fälgstorlek, märken och lagervärde',
			to: 'lager',
			more: 'Mer om lagret',
		},
	];

	readonly overview: { title: string; text: string; to?: string; more?: string }[] = [
		{ title: 'Arbetsorder', text: 'Jobb och delar på samma order. Finns inte delen i lager syns det direkt, med en knapp för att beställa. Mekanikern får ett utskrivet arbetsblad.', to: 'arbetsorder', more: 'Mer om arbetsordern' },
		{ title: 'Sök', text: 'Ett sökfält för regnummer, kund, telefonnummer, hylla och däckstorlek.' },
		{ title: 'Kunder och bilar', text: 'Bilens uppgifter hämtas från regnumret.' },
		{ title: 'I mobilen', text: 'Dagens bokningar, däckhotellet och lagret när du står i verkstaden.' },
		{ title: 'Startsidan', text: 'Dagens bokningar och en lista över det som väntar: försenade däckset, artiklar som är slut och obetalda fakturor.' },
		{ title: 'Faktura och kvitto', text: 'Säljkort med rabatt, faktura eller kvitto och momsrapport.' },
	];

	private readonly defaultPlans: Plan[] = [
		{
			name: 'Däck',
			price: '495',
			users: '2 användare ingår',
			blurb: 'För dig som lagrar och säljer däck.',
			features: ['Lager och artiklar', 'Däckhotell', 'Kunder och bilar', 'Rapporter'],
		},
		{
			name: 'Verkstad',
			price: '1 295',
			users: '5 användare ingår',
			blurb: 'För hela verkstaden, från bokning till bokföring.',
			features: ['Allt i Däck', 'Bokningar', 'Arbetsorder', 'Bokföring'],
			highlight: true,
		},
	];

	/** Defaults until (or unless) the live catalog from the backend arrives. */
	readonly plans = signal<Plan[]>(this.defaultPlans);
	readonly extraUserPrice = signal('99');

	readonly form = this.fb.nonNullable.group({
		name: ['', [Validators.required, Validators.maxLength(120)]],
		workshop: ['', [Validators.maxLength(160)]],
		email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
		phone: ['', [Validators.maxLength(40)]],
		message: ['', [Validators.required, Validators.maxLength(4000)]],
		website: [''], // honeypot, ska förbli tom
	});
	readonly state = signal<FormState>('idle');
	readonly submitted = signal(false);

	private get apiBase(): string {
		return isDevMode() ? 'http://localhost:3000/api' : 'https://api.catso.io/api';
	}

	async ngOnInit(): Promise<void> {
		if (!this.browser) return;
		try {
			const res = await firstValueFrom(
				this.http.get<{ data: Catalog }>(`${this.apiBase}/inventory/plans`, {
					headers: new HttpHeaders({ 'X-App-Id': 'garagestock' }),
				}),
			);
			const fmt = (minor: number) => new Intl.NumberFormat('sv-SE').format(minor / 100);
			this.plans.set(
				res.data.plans.map((p) => ({
					name: p.name,
					price: fmt(p.priceMinor),
					users: `${p.includedUsers} användare ingår`,
					blurb: p.blurb,
					features: p.features,
					highlight: p.id === 'verkstad',
				})),
			);
			this.extraUserPrice.set(fmt(res.data.extraUserPriceMinor));
		} catch {
			// Behåller standardpriserna om katalogen inte kan hämtas.
		}
	}

	/** Parallax och inglidning vid scroll, bara på dator och om användaren inte valt minskad rörelse. */
	ngAfterViewInit(): void {
		if (!this.browser) return;
		const root = this.host.nativeElement;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const desktop = matchMedia('(min-width: 1024px)');
		if (reduce) return;

		const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
		reveals.forEach((el) => el.classList.add('reveal'));
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						e.target.classList.add('reveal-in');
						io.unobserve(e.target);
					}
				}
			},
			{ threshold: 0.12 },
		);
		reveals.forEach((el) => io.observe(el));

		const items = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
		let ticking = false;
		const update = () => {
			ticking = false;
			const vh = innerHeight;
			for (const el of items) {
				if (!desktop.matches) {
					el.style.transform = '';
					continue;
				}
				const speed = parseFloat(el.dataset['parallax'] ?? '0');
				const r = el.parentElement!.getBoundingClientRect();
				if (r.bottom < -200 || r.top > vh + 200) continue;
				const offset = (r.top + r.height / 2 - vh / 2) * speed * -1;
				el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
			}
		};
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		};
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll, { passive: true });
		update();
		this.cleanup = () => {
			io.disconnect();
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
		};
	}

	ngOnDestroy(): void {
		this.cleanup?.();
	}

	/** Förifyller meddelandet när någon klickar på en plan i prislistan. */
	choosePlan(name: string): void {
		const msg = this.form.controls.message;
		if (!msg.value) msg.setValue(`Hej! Jag är intresserad av planen ${name}. `);
	}

	toggleMenu(): void {
		this.menuOpen.update((v) => !v);
	}

	async submit(): Promise<void> {
		this.submitted.set(true);
		if (this.form.invalid || this.state() === 'sending' || !this.browser) return;
		this.state.set('sending');
		try {
			await firstValueFrom(
				this.http.post(`${this.apiBase}/contact`, {
					...this.form.getRawValue(),
					product: this.product,
				}),
			);
			this.state.set('sent');
			this.form.reset();
			this.submitted.set(false);
		} catch {
			this.state.set('error');
		}
	}
}

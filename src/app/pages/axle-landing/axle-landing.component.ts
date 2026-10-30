import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	PLATFORM_ID,
	inject,
	isDevMode,
	signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { VERKSTAD_FAQ } from '../../seo/faq.data';

interface Feature {
	id: string;
	title: string;
	text: string;
	points: string[];
	image: string;
	alt: string;
	phone?: string;
	phoneAlt?: string;
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
const PHOTO = '/assets/imgs/verkstad';

/** Produktnamnet står på ett ställe så det är lätt att byta. */
export const PRODUCT_NAME = 'Catso Verkstad';

@Component({
	selector: 'app-inventory-landing',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterLink, ReactiveFormsModule],
	templateUrl: './inventory-landing.component.html',
	styleUrl: './inventory-landing.component.scss',
})
export class InventoryLandingComponent implements OnInit {
	private readonly http = inject(HttpClient);
	private readonly fb = inject(FormBuilder);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

	readonly product = PRODUCT_NAME;
	readonly manual = MANUAL;
	readonly photo = PHOTO;
	/** Länk till själva appen. Tom tills adressen är bestämd, då döljs "Logga in". */
	readonly appUrl = '';
	readonly currentYear = new Date().getFullYear();
	readonly menuOpen = signal(false);

	readonly faqs = VERKSTAD_FAQ;

	readonly features: Feature[] = [

		{
			id: 'dackhotell',
			title: 'Däckhotell',
			text: 'Varje set har regnummer, hylla och avgift. Översikten visar vilka som ska hämtas vecka för vecka, vilka hyllor som är fulla och vilka kunder som har under 4 mm kvar, så du vet vem du ska ringa om nya däck.',
			points: ['Etikett att sätta på setet', 'Obetalda avgifter och försenade hämtningar'],
			image: `${PHOTO}/app-hotellov.jpg`,
			alt: 'Översikten för däckhotellet med hämtningar per vecka, hyllor och mönsterdjup',
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
			points: ['Dag, vecka och månad', 'Bokningen blir en arbetsorder när bilen kommer'],
			image: `${PHOTO}/app-resurser.jpg`,
			alt: 'Tidsbokningen med en kolumn per mekaniker och lyft',
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
		},
		{
			id: 'lager',
			title: 'Lager',
			text: 'Däck per fälgstorlek och säsong, märken, lagervärde och vad som ska beställas. Däckens ålder räknas fram från DOT-koden, så de äldsta säljs först.',
			points: ['Sök på dimension, märke eller artikelnummer', 'Inköp och leverantörer'],
			image: `${PHOTO}/app-lagerov.jpg`,
			alt: 'Översikten för lagret med däck per fälgstorlek, märken och lagervärde',
		},
	];

	readonly overview = [
		{ title: 'Arbetsorder', text: 'Jobb och delar på samma order. Finns inte delen i lager syns det direkt, med en knapp för att beställa. Mekanikern får ett utskrivet arbetsblad utan priser.' },
		{ title: 'Sök', text: 'Ett sökfält för regnummer, kund, telefonnummer, hylla och däckstorlek.' },
		{ title: 'Kunder och bilar', text: 'Bilens uppgifter hämtas från regnumret. Kunden och bilen följer med till bokning, däckhotell och arbetsorder.' },
		{ title: 'I mobilen', text: 'Dagens bokningar, däckhotellet och lagret när du står i verkstaden.' },
		{ title: 'Behörigheter och logg', text: 'Personalen ser inte inköpspriser eller bokföring. Aktivitetsloggen visar vem som ändrade vad.' },
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

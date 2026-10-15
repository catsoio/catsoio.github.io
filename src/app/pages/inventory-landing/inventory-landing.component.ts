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

interface Feature {
	id: string;
	title: string;
	headline: string;
	text: string;
	points: string[];
	image: string;
	alt: string;
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

const IMG = '/assets/imgs/dacklager';

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
	readonly img = IMG;
	/** Länk till själva appen. Tom tills adressen är bestämd, då döljs "Logga in". */
	readonly appUrl = '';
	readonly currentYear = new Date().getFullYear();
	readonly menuOpen = signal(false);

	readonly pains = [
		{ title: 'Hjulen är borta', text: 'Kunden ringer och undrar om bilen är klar. Du går ut och letar bland hyllorna efter rätt hjulset.' },
		{ title: 'Saldot stämmer inte', text: 'Systemet säger fyra däck, hyllan har två. Du upptäcker det först när kunden står vid disken.' },
		{ title: 'Papper överallt', text: 'Bokningen på en lapp, arbetsordern i en pärm och fakturaunderlaget i ett Excelark.' },
	];

	readonly features: Feature[] = [
		{
			id: 'lager',
			title: 'Lager',
			headline: 'Lager och saldo',
			text: 'Saldo, hyllplats och pris på varje artikel. Sök på dimension eller märke.',
			points: [],
			image: `${IMG}/desktop-inventory.webp`,
			alt: 'Artikellistan med däck, fälgar och lagersaldo',
		},
		{
			id: 'dackhotell',
			title: 'Däckhotell',
			headline: 'Däckhotell',
			text: 'Kundens hjulset med regnummer, plats och avgift. Obetalda hämtningar syns direkt.',
			points: [],
			image: `${IMG}/desktop-storage.webp`,
			alt: 'Listan över inlagrade däck i däckhotellet',
		},
		{
			id: 'bokningar',
			title: 'Bokningar',
			headline: 'Bokningar per mekaniker',
			text: 'Veckokalender per mekaniker. Ett klick gör bokningen till en arbetsorder.',
			points: [],
			image: `${IMG}/desktop-bookings.webp`,
			alt: 'Veckokalender med bokningar per mekaniker',
		},
		{
			id: 'arbetsorder',
			title: 'Arbetsorder',
			headline: 'Arbetsorder med delar och summa',
			text: 'Arbete och delar på samma order. Delarna tas från lagret.',
			points: [],
			image: `${IMG}/desktop-workorder.webp`,
			alt: 'Arbetsorder med arbete, delar och summa',
		},
	];

	readonly mobileShots = [
		{ src: `${IMG}/mobile-inventory.webp`, alt: 'Lagret i mobilen', label: 'Lager' },
		{ src: `${IMG}/mobile-bookings.webp`, alt: 'Bokningar i mobilen', label: 'Bokningar' },
		{ src: `${IMG}/mobile-storage.webp`, alt: 'Däckhotellet i mobilen', label: 'Däckhotell' },
	];

	readonly overview = [
		{ title: 'Kunder och bilar', text: 'Lägg in dem en gång, välj dem sedan var du vill.' },
		{ title: 'Leverantörer', text: 'Vem du handlar av och vad du har köpt.' },
		{ title: 'Rapporter', text: 'Försäljning, bruttovinst och inköp, per period.' },
		{ title: 'Bokföring', text: 'Stäng månaden och lämna över underlaget till redovisaren.' },
		{ title: 'Behörigheter', text: 'Du som äger ser allt. Personalen jobbar i systemet men ser varken inköpspriser eller bokföring.' },
		{ title: 'Dator, surfplatta, mobil', text: 'Det körs i webbläsaren. Inget program att installera eller uppdatera.' },
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

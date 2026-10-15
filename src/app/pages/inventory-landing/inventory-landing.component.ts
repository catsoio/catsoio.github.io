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
export const PRODUCT_NAME = 'Catso Bay';

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
	readonly appUrl = '/inv/';
	readonly currentYear = new Date().getFullYear();
	readonly menuOpen = signal(false);

	readonly features: Feature[] = [
		{
			id: 'lager',
			title: 'Lager',
			text: 'Däck, fälgar och delar med saldo, hyllplats samt inköps- och försäljningspris. Saldot ändras när du köper in, säljer eller tar emot en retur.',
			points: [
				'Sök på dimension, märke eller hyllplats',
				'Se marginalen på varje artikel',
				'Historik över vad som tagits ut och av vem',
				'Varning när saldot går under din gräns',
			],
			image: `${IMG}/desktop-inventory.webp`,
			alt: 'Artikellistan med däck, fälgar och lagersaldo',
		},
		{
			id: 'dackhotell',
			title: 'Däckhotell',
			text: 'Lägg in kundens däck med regnummer, säsong, plats och avgift. När kunden kommer tillbaka vet du var hjulen står och om de är betalda.',
			points: [
				'Däck med eller utan fälg',
				'Obetalda och försenade hämtningar markeras',
				'Plats och skick på varje hjulset',
				'Utlämning och betalning noteras direkt',
			],
			image: `${IMG}/desktop-storage.webp`,
			alt: 'Listan över inlagrade däck i däckhotellet',
		},
		{
			id: 'bokningar',
			title: 'Bokningar',
			text: 'En kalender för verkstaden. Boka in bilen hos rätt mekaniker eller på rätt plats och se dagen på en gång.',
			points: [
				'Dag-, vecka- och månadsvy',
				'Kalender per mekaniker och plats',
				'Vad som ska göras och överenskommet pris',
				'Gör om bokningen till en arbetsorder',
			],
			image: `${IMG}/desktop-bookings.webp`,
			alt: 'Veckokalender med bokningar per mekaniker',
		},
		{
			id: 'arbetsorder',
			title: 'Arbetsorder',
			text: 'Arbete och delar på samma order. Kund och bil är redan ifyllda från bokningen, och mekanikern får en utskrift att jobba efter.',
			points: [
				'Delar tas från lagret',
				'Status från öppen till klar',
				'Utskrift till mekanikern',
				'Underlag till bokföringen',
			],
			image: `${IMG}/desktop-workorder.webp`,
			alt: 'Arbetsorder med arbete, delar och summa',
		},
	];

	readonly mobileShots = [
		{ src: `${IMG}/mobile-dashboard.webp`, alt: 'Översikt i mobilen', label: 'Översikt' },
		{ src: `${IMG}/mobile-inventory.webp`, alt: 'Lagret i mobilen', label: 'Lager' },
		{ src: `${IMG}/mobile-bookings.webp`, alt: 'Bokningar i mobilen', label: 'Bokningar' },
		{ src: `${IMG}/mobile-storage.webp`, alt: 'Däckhotellet i mobilen', label: 'Däckhotell' },
	];

	readonly overview = [
		{ title: 'Kunder och bilar', text: 'Lägg in kunden och bilen en gång. De går sedan att välja överallt i systemet.' },
		{ title: 'Leverantörer', text: 'Se vem du köper av och vad du har köpt.' },
		{ title: 'Rapporter', text: 'Försäljning, bruttovinst och inköp per period.' },
		{ title: 'Bokföring', text: 'Stäng perioden och få ett underlag att lämna vidare.' },
		{ title: 'Användare och behörighet', text: 'Ägaren ser allt. Personalen kan arbeta i systemet men ser inte inköpspriser eller bokföring.' },
		{ title: 'Mobil och surfplatta', text: 'Systemet körs i webbläsaren, så du kan slå upp saldo vid hyllan eller en bokning vid disken.' },
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

	readonly faqs = [
		{
			q: 'Hur kommer vi igång?',
			a: 'Fyll i formuläret eller mejla oss. Vi skapar kontot åt er och hjälper till att lägga in det ni vill börja med. Därefter bjuder ni in kollegor själva.',
		},
		{
			q: 'Kan vi prova först?',
			a: 'Ja, ni får 14 dagar att prova alla funktioner i planen Verkstad.',
		},
		{
			q: 'Gäller priserna med moms?',
			a: 'Priserna är per månad och utan moms. Svensk moms på 25 % läggs till på fakturan.',
		},
		{
			q: 'Hur räknas användare?',
			a: 'Varje plan har ett antal användare inkluderade. Behöver ni fler kostar det extra per användare och månad, se priserna ovan.',
		},
		{
			q: 'Kan alla i verkstaden se allt?',
			a: 'Nej. Ägaren har full åtkomst. Personalen kan arbeta med lager, bokningar och arbetsorder men ser inte inköpspriser eller bokföring.',
		},
		{
			q: 'Måste vi installera något?',
			a: 'Nej. Systemet körs i webbläsaren på dator, surfplatta och mobil.',
		},
		{
			q: 'Kan vi byta plan eller säga upp?',
			a: 'Ja, plan och uppsägning hanteras i kundportalen.',
		},
	];

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

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
		{ title: 'Var är hjulen?', text: 'Kunden ringer och frågar om bilen är klar. Du går ut och letar bland hyllorna efter rätt set, och hoppas att någon ställde tillbaka det på rätt plats.' },
		{ title: 'Saldot stämmer inte', text: 'Systemet säger fyra däck, hyllan har två. Det märks först när kunden redan står vid disken.' },
		{ title: 'Papper överallt', text: 'Bokningen på en lapp, arbetsordern i en pärm och underlaget till fakturan i ett Excelark som bara en person förstår.' },
	];

	readonly features: Feature[] = [
		{
			id: 'lager',
			title: 'Lager',
			headline: 'Du ser vad du har, och vad som snart är slut',
			text: 'Varje artikel har saldo, hyllplats och pris. Du söker på dimension eller märke och ser direkt om det finns. När något börjar ta slut hamnar det i listan över vad du behöver beställa, så du slipper upptäcka det när kunden redan är på plats.',
			points: ['Sök på dimension, märke eller artikelnummer', 'Varning för lågt lager och slut', 'Inköp och leverantörer på samma ställe', 'Se bruttovinst och marginal per period'],
			image: `${IMG}/desktop-inventory.webp`,
			alt: 'Artikellistan med däck, fälgar och lagersaldo',
		},
		{
			id: 'dackhotell',
			title: 'Däckhotell',
			headline: 'Varje hjulset har en plats och en ägare',
			text: 'Du lägger in kundens set med regnummer, hyllplats och avgift. Du ser vilka som är betalda, vilka som inte är det och vilka som skulle ha hämtats för länge sedan. Vid säsongsbytet vet du precis var allt står.',
			points: ['Regnummer, plats och avgift per set', 'Obetalda och försenade hämtningar syns på startsidan', 'Sök fram kunden på sekunder när hen ringer'],
			image: `${IMG}/desktop-storage.webp`,
			alt: 'Listan över inlagrade däck i däckhotellet',
		},
		{
			id: 'bokningar',
			title: 'Bokningar',
			headline: 'En kalender där alla mekaniker syns',
			text: 'Se veckan per mekaniker, flytta en bokning genom att dra den och lägg till en ny på ett par sekunder. När kunden kommer gör du bokningen till en arbetsorder med ett klick, så skriver du inte in samma uppgifter två gånger.',
			points: ['Vecko-, dag- och månadsvy', 'Filtrera på en enskild mekaniker', 'Bokning blir arbetsorder med kund och bil ifyllda'],
			image: `${IMG}/desktop-bookings.webp`,
			alt: 'Veckokalender med bokningar per mekaniker',
		},
		{
			id: 'arbetsorder',
			title: 'Arbetsorder',
			headline: 'Från inlämnad bil till färdig faktura',
			text: 'Arbete och delar står på samma order. Mekanikern öppnar den i mobilen, ser bara det som rör hens egna bilar och bockar av raderna när de är gjorda. När ordern är klar tas delarna ur lagret, och du kan skriva ut faktura eller kvitto med moms utan att räkna något för hand.',
			points: ['Egen mobilvy för mekanikern, utan priser och kunduppgifter', 'Delar tas ur lagret när ordern blir klar', 'Faktura och kvitto med rätt moms och löpande nummer', 'Status: öppen, pågår, väntar på del, klar'],
			image: `${IMG}/desktop-workorder.webp`,
			alt: 'Arbetsorder med arbete, delar och summa',
		},
		{
			id: 'ekonomi',
			title: 'Fakturor och ekonomi',
			headline: 'Du ser vem som inte har betalat',
			text: 'Faktura och kvitto är två olika dokument. En faktura får förfallodatum, betalningsvillkor och betalningsuppgifter, och ett kvitto är betalt direkt. I fakturalistan ser du vad som är obetalt, vad som har passerat förfallodatum och vad som kommit in den senaste månaden.',
			points: ['Faktura eller kvitto, du väljer när du bokför', 'Obetalt, förfallet och betalt på ett ögonkast', 'Moms per sats och löpande nummer på varje dokument', 'Moms och bokföring som underlag till redovisaren'],
			image: `${IMG}/desktop-invoices.webp`,
			alt: 'Fakturalistan med obetalda, förfallna och betalda fakturor',
		},
	];

	readonly mobileShots = [
		{ src: `${IMG}/mobile-inventory.webp`, alt: 'Lagret i mobilen', label: 'Lager' },
		{ src: `${IMG}/mobile-bookings.webp`, alt: 'Bokningar i mobilen', label: 'Bokningar' },
		{ src: `${IMG}/mobile-storage.webp`, alt: 'Däckhotellet i mobilen', label: 'Däckhotell' },
	];

	readonly overview = [
		{ title: 'Kunder och bilar', text: 'Lägg in kunden och bilen en gång. Sedan väljer du dem i bokning, däckhotell och arbetsorder i stället för att skriva om dem. Företagskunder får organisationsnummer och adress på fakturan.' },
		{ title: 'Leverantörer', text: 'Vem du handlar av och vad du har köpt, så du hittar tillbaka när något ska beställas om.' },
		{ title: 'Rapporter', text: 'Försäljning, bruttovinst och inköp för vald period. Inga egna sammanställningar i Excel.' },
		{ title: 'Moms och bokföring', text: 'Momsrapport för utgående moms och ett underlag du kan lämna till redovisaren när månaden är stängd.' },
		{ title: 'Behörigheter', text: 'Ägaren ser allt. Personalen jobbar i systemet men ser inte inköpspriser eller bokföring, och mekanikerna ser bara sina egna order.' },
		{ title: 'Dator, surfplatta och mobil', text: 'Det körs i webbläsaren, så det finns inget att installera och ingen uppdatering att komma ihåg. Det funkar lika bra i verkstaden som vid disken.' },
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

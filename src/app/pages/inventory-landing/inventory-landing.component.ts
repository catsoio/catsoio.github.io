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
			image: `${MANUAL}/5-artiklar.webp`,
			alt: 'Artikellistan med däck, märke, modell och hyllplats',
		},
		{
			id: 'bokningar',
			title: 'Bokningar',
			headline: 'Ny bokning på några sekunder',
			text: 'Skriv kundens namn eller telefonnummer, välj tid och mekaniker. När kunden kommer gör du bokningen till en arbetsorder med ett klick, så skriver du inte in samma uppgifter två gånger.',
			points: ['Vecko-, dag- och månadsvy, och en kolumn per mekaniker', 'Sök kunden på namn eller telefonnummer', 'Bokning blir arbetsorder med kund och bil ifyllda'],
			image: `${MANUAL}/6-bokning.webp`,
			alt: 'Dialogen Ny bokning med kund, bil, tid och mekaniker',
		},
		{
			id: 'forsaljning',
			title: 'Försäljning',
			headline: 'Du väljer själv: faktura eller kvitto',
			text: 'Allt som säljs går via ett säljkort med kund, bil, rader och rabatt. När du bokför tar delarna slut i lagret och dokumentet får sitt nummer. En faktura får förfallodatum och betalningsvillkor, ett kvitto är betalt direkt.',
			points: ['Delar tas ur lagret när du bokför', 'Moms per sats och löpande nummer på varje dokument', 'Förhandsgranska utkastet innan du bokför'],
			image: `${MANUAL}/7-forsaljning.webp`,
			alt: 'Säljkort där man väljer att bokföra som faktura eller kvitto',
		},
		{
			id: 'ekonomi',
			title: 'Fakturor och ekonomi',
			headline: 'Du ser vem som inte har betalat',
			text: 'I fakturalistan ser du vad som är obetalt, vad som har passerat förfallodatum och vad som kommit in den senaste månaden. Momsrapport och bokföringsunderlag finns för redovisaren.',
			points: ['Obetalt, förfallet och betalt på ett ögonkast', 'Filtrera på faktura eller kvitto', 'Moms och bokföring som underlag till redovisaren'],
			image: `${MANUAL}/8-fakturor.webp`,
			alt: 'Fakturalistan med obetalda, förfallna och betalda fakturor',
		},
	];

	readonly trustStrip = [
		{ title: 'Ingen bindning', text: 'Testa först, bestäm sen.', icon: 'M5 13l4 4L19 7' },
		{ title: 'Svensk support', text: 'Vi svarar oftast samma dag.', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
		{ title: 'Inget att installera', text: 'Körs i webbläsaren, överallt.', icon: 'M3 5h18v11H3zM8 21h8M12 16v5' },
		{ title: 'Rätt moms på dokumenten', text: 'Faktura och kvitto med löpande nummer.', icon: 'M9 12l2 2 4-4M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' },
	];

	readonly hotelRows = [
		{ reg: 'ABC 123', what: 'Vinterhjul, 205/55 R16', shelf: 'Hylla H-12', status: 'Betald', tone: 'ok' },
		{ reg: 'TAX 101', what: 'Sommarhjul, 225/45 R17', shelf: 'Hylla B-03', status: 'Obetald', tone: 'warn' },
		{ reg: 'LIN 202', what: 'Vinterhjul, 195/65 R15', shelf: 'Hylla H-14', status: 'Skulle hämtats', tone: 'late' },
	];

	readonly hotelPoints = [
		'Regnummer, plats och avgift per set',
		'Obetalda och försenade hämtningar syns på startsidan',
		'Kalla in kunderna med SMS när det är dags för byte',
	];

	readonly trust = [
		{ title: 'Rätt person ser rätt sak', text: 'Ägaren ser allt. Personalen ser inte inköpspriser eller bokföring, och mekanikern får ett arbetsblad utan priser.' },
		{ title: 'Inga luckor i numreringen', text: 'Fakturor och kvitton får egna löpande nummer. Ett bokfört dokument går inte att ändra i efterhand.' },
		{ title: 'Alla ändringar loggas', text: 'Aktivitetsloggen visar vem som gjorde vad och när, så ni kan reda ut vad som hänt.' },
		{ title: 'Frågor besvaras av människor', text: 'Ni når oss på support@catso.io, och vi hjälper till att lägga in era första artiklar och kunder.' },
	];

	readonly steps = [
		{ title: 'Vi sätter upp en testmiljö', text: 'Helst med några av era egna artiklar och kunder, så att det känns som er verkstad.' },
		{ title: 'Ni klickar runt i lugn och ro', text: 'Du och personalen provar bokning, däckhotell och arbetsorder. Manualen visar steg för steg.' },
		{ title: 'Ni bestämmer själva', text: 'Det kostar inget att prova och ni förbinder er inte till något.' },
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

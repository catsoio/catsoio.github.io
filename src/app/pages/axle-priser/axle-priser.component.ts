import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	PLATFORM_ID,
	afterNextRender,
	computed,
	effect,
	inject,
	signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
	DOMAIN_YEAR_PRICE,
	EXTRA_SCREEN_PRICE,
	EXTRA_USER_PRICE,
	HALL_PRICE,
	PAYMENT_FEE,
	PLANS,
	SMS_OVER_PRICE,
	VAT_RATE,
	YEAR_PAID_MONTHS,
	describeSelection,
	quote,
	sanitizeConfig,
	type Config,
	type Period,
	type PlanId,
} from './axle-priser.pricing';

/** Produktnamnet står på samma sätt som på sidan /apps/axle. */
const PRODUCT_NAME = 'Catso Axle';

/** Valet i räknaren sparas här i besökarens webbläsare, så det finns kvar när hen kommer tillbaka. */
const SAVED_KEY = 'catso.axle.priser.v1';

const MAX_USERS = 50;
const MAX_SCREENS = 10;

const whole = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });
const fmt = (n: number): string => whole.format(Math.round(n));
const kr = (n: number): string => `${fmt(n)} kr`;
const comma = (n: number, decimals: number): string => n.toFixed(decimals).replace('.', ',');

interface Point {
	text: string;
	/** Byggt men inte påslaget än, eller inte byggt. Visas som "Kommer". */
	soon?: boolean;
}

interface Package {
	name: string;
	price: string;
	priceNote?: string;
	blurb: string;
	points: Point[];
}

interface Rule {
	title: string;
	text: string;
	soon?: boolean;
}

/**
 * Prissida med prisräknare och kontakt. Besökarens val sparas i webbläsaren och följer med i
 * meddelandet som skickas härifrån, så vi ser vad hen räknat på. Kontaktformuläret ligger på
 * sidan (#kontakt) så att besökaren aldrig behöver lämna räknaren. Priserna och räkningen finns
 * i axle-priser.pricing.ts.
 */
@Component({
	selector: 'app-axle-priser',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, RouterLink, ReactiveFormsModule],
	templateUrl: './axle-priser.component.html',
	styleUrl: './axle-priser.component.scss',
})
export class AxlePriserComponent {
	readonly product = PRODUCT_NAME;
	readonly currentYear = new Date().getFullYear();

	readonly fmt = fmt;
	readonly kr = kr;
	readonly plans = Object.values(PLANS);
	readonly maxUsers = MAX_USERS;
	readonly maxScreens = MAX_SCREENS;
	readonly extraUserPrice = EXTRA_USER_PRICE;
	readonly extraScreenPrice = EXTRA_SCREEN_PRICE;
	readonly domainYearPrice = DOMAIN_YEAR_PRICE;
	readonly hallStandalone = HALL_PRICE.standalone;
	readonly smsOverPrice = comma(SMS_OVER_PRICE, 2);
	readonly feePercent = comma(PAYMENT_FEE.percent, 1);
	readonly feeMaxKr = PAYMENT_FEE.maxKr;
	readonly vatPercent = VAT_RATE * 100;
	readonly freeMonths = 12 - YEAR_PAID_MONTHS;

	readonly plan = signal<PlanId>('verkstad');
	readonly users = signal(PLANS.verkstad.users);
	readonly hall = signal(false);
	readonly screens = signal(0);
	readonly domain = signal(false);
	readonly period = signal<Period>('month');
	readonly sms = signal(0);
	readonly cardVolume = signal(0);
	readonly avgPayment = signal(2500);

	readonly current = computed(() => PLANS[this.plan()]);
	readonly hallPrice = computed(() =>
		this.plan() === 'verkstad' ? HALL_PRICE.addon : HALL_PRICE.standalone,
	);
	readonly q = computed(() =>
		quote({
			plan: this.plan(),
			users: this.users(),
			hall: this.hall(),
			screens: this.screens(),
			domain: this.domain(),
			period: this.period(),
			smsPerMonth: this.sms(),
			cardVolume: this.cardVolume(),
			avgPayment: this.avgPayment(),
		}),
	);

	/** Allt besökaren valt, i samma form som räkningen och det sparade värdet. */
	readonly config = computed<Config>(() => ({
		plan: this.plan(),
		users: this.users(),
		hall: this.hall(),
		screens: this.screens(),
		domain: this.domain(),
		period: this.period(),
		smsPerMonth: this.sms(),
		cardVolume: this.cardVolume(),
		avgPayment: this.avgPayment(),
	}));
	/** Valet som läsbara rader, både på sidan och i mejlet. */
	readonly selection = computed(() => describeSelection(this.config(), this.q()));

	private readonly http = inject(HttpClient);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly fb = inject(FormBuilder);
	/** Sparar först när det sparade valet lästs, annars skriver standardvärdena över det. */
	private readonly restored = signal(false);

	readonly form = this.fb.nonNullable.group({
		name: ['', [Validators.required, Validators.maxLength(120)]],
		workshop: ['', [Validators.maxLength(160)]],
		email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
		phone: ['', [Validators.maxLength(40)]],
		message: ['', [Validators.maxLength(3000)]],
		website: [''], // honeypot, ska förbli tom
	});
	readonly state = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
	readonly submitted = signal(false);

	constructor() {
		// Läses efter hydreringen: den förrenderade sidan har standardvalen, och ett annat värde
		// i första renderingen skulle inte stämma med den.
		afterNextRender(() => {
			const saved = this.readSaved();
			if (saved) this.apply(saved);
			this.restored.set(true);
		});
		effect(() => {
			const config = this.config();
			if (!this.browser || !this.restored()) return;
			try {
				localStorage.setItem(SAVED_KEY, JSON.stringify(config));
			} catch {
				// Utan lagring fungerar räknaren som vanligt, valet sparas bara inte.
			}
		});
	}

	private readSaved(): Config | null {
		try {
			return sanitizeConfig(JSON.parse(localStorage.getItem(SAVED_KEY) ?? 'null'));
		} catch {
			return null;
		}
	}

	private apply(c: Config): void {
		this.plan.set(c.plan);
		this.users.set(c.users);
		this.hall.set(c.hall);
		this.screens.set(c.screens);
		this.domain.set(c.domain);
		this.period.set(c.period);
		this.sms.set(c.smsPerMonth);
		this.cardVolume.set(c.cardVolume);
		this.avgPayment.set(c.avgPayment);
	}

	/** Skickar förfrågan och lägger valet i räknaren sist i meddelandet. */
	async submit(): Promise<void> {
		this.submitted.set(true);
		if (this.form.invalid || this.state() === 'sending' || !this.browser) return;
		this.state.set('sending');
		const { message, ...rest } = this.form.getRawValue();
		const text = [
			message.trim() || 'Förfrågan från prissidan, se valet nedan.',
			'',
			'Valt i prisräknaren på /axle/priser:',
			...this.selection().map((l) => `- ${l}`),
		].join('\n');
		try {
			await firstValueFrom(
				this.http.post(`${environment.apiBaseUrl}/api/contact`, {
					...rest,
					message: text,
					product: 'Catso Axle, priser',
				}),
			);
			this.state.set('sent');
		} catch {
			this.state.set('error');
		}
	}

	readonly packages: Package[] = [
		{
			name: PLANS.dack.name,
			price: fmt(PLANS.dack.price),
			blurb: PLANS.dack.blurb,
			points: [
				{ text: 'Lager och artiklar' },
				{ text: 'Däckhotell med hyllplatser, avgifter och etikett' },
				{ text: 'Kalla in kunder med SMS inför bytet' },
				{ text: 'Kunder och bilar, bilens uppgifter hämtas från regnumret' },
			],
		},
		{
			name: PLANS.verkstad.name,
			price: fmt(PLANS.verkstad.price),
			blurb: PLANS.verkstad.blurb,
			points: [
				{ text: 'Allt i Däck' },
				{ text: 'Tidsbokning med en kolumn per mekaniker och lyft' },
				{ text: 'Arbetsorder och arbetsblad till mekanikern' },
				{ text: 'Offert som kunden godkänner i mobilen' },
				{ text: 'Säljkort, faktura och kvitto, ekonomi och momsrapport' },
				{ text: 'Bokningssida där kunderna skickar en förfrågan' },
				{ text: 'Verkstadsskärm med dagens arbetsorder', soon: true },
			],
		},
		{
			name: 'Hall',
			price: fmt(HALL_PRICE.standalone),
			priceNote: `${fmt(HALL_PRICE.addon)} kr/mån för er som har Verkstad`,
			blurb: 'För dig som säljer bilar.',
			points: [
				{ text: 'Bilregister med inköpspris, kostnader och vinst per bil' },
				{ text: 'Annonser på Blocket och Bytbil', soon: true },
				{ text: 'Egen webbplats för bilarna' },
				{ text: 'Bilaffärer med faktura, även vinstmarginalbeskattning' },
				{ text: 'Intresseanmälningar samlas på bilen' },
			],
		},
	];

	readonly rules: Rule[] = [
		{
			title: 'Användare',
			text: `Däck har ${PLANS.dack.users} och Verkstad ${PLANS.verkstad.users} användare. Fler kostar ${EXTRA_USER_PRICE} kr/mån styck. Ägare, personal och mekaniker räknas alla.`,
		},
		{
			title: 'SMS',
			text: `${PLANS.dack.sms} SMS per månad ingår i Däck och ${PLANS.verkstad.sms} i Verkstad. Därefter kostar det ${comma(SMS_OVER_PRICE, 2)} kr per SMS.`,
		},
		{
			title: 'Betalningar via Axle',
			text: `Kort och Swish betalas till ert eget Stripe-konto. Vi tar ${comma(PAYMENT_FEE.percent, 1)} % per betalning, högst ${PAYMENT_FEE.maxKr} kr. Stripe tar dessutom sin egen avgift, från 1,5 % + 1,80 kr per kortbetalning, som ni betalar direkt till Stripe.`,
		},
		{
			title: 'Bilhandel',
			text: `Hall kostar ${fmt(HALL_PRICE.standalone)} kr/mån, eller ${fmt(HALL_PRICE.addon)} kr/mån för er som har Verkstad. En egen domän till webbplatsen kostar ${DOMAIN_YEAR_PRICE} kr per år.`,
		},
		{
			title: 'Verkstadsskärm',
			text: `En skärm ingår i Verkstad. Fler kostar ${EXTRA_SCREEN_PRICE} kr/mån styck.`,
			soon: true,
		},
		{
			title: 'Årsvis',
			text: `Betalar ni ett år i taget får ni ${12 - YEAR_PAID_MONTHS} månader gratis.`,
		},
		{
			title: 'Moms',
			text: `Alla priser är exklusive moms (${VAT_RATE * 100} %).`,
		},
	];

	/** Ett byte av paket börjar om med paketets användare, och skärmar finns bara i Verkstad. */
	choosePlan(id: PlanId): void {
		this.plan.set(id);
		this.users.set(PLANS[id].users);
		if (id !== 'verkstad') this.screens.set(0);
	}

	setUsers(n: number): void {
		this.users.set(Math.min(Math.max(n, this.current().users), MAX_USERS));
	}

	setScreens(n: number): void {
		this.screens.set(Math.min(Math.max(n, 0), MAX_SCREENS));
	}

	toggleHall(on: boolean): void {
		this.hall.set(on);
		if (!on) this.domain.set(false);
	}

	/** Heltal ur ett fält, aldrig negativt. Tomt eller ogiltigt blir 0. */
	wholeNumber(event: Event): number {
		const n = Math.floor(Number((event.target as HTMLInputElement).value));
		return Number.isFinite(n) ? Math.min(Math.max(n, 0), 10_000_000) : 0;
	}

	checked(event: Event): boolean {
		return (event.target as HTMLInputElement).checked;
	}
}

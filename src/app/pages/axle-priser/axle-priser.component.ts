import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
	quote,
	type Period,
	type PlanId,
} from './axle-priser.pricing';

/** Produktnamnet står på samma sätt som på sidan /apps/axle. */
const PRODUCT_NAME = 'Catso Axle';

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
 * Prissida med prisräknare. Den är inte länkad från menyn, inte med i sitemap.xml och har noindex,
 * så den syns bara för den som har adressen. Visa den genom att länka den från axle-landing och
 * ta bort `robots` i AXLE_PRISER_SEO. Priserna och räkningen finns i axle-priser.pricing.ts.
 */
@Component({
	selector: 'app-axle-priser',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, RouterLink],
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

/**
 * Prislistan för Catso Axle och räkningen bakom prisräknaren på /axle/priser.
 *
 * Alla belopp är kronor exklusive moms. De ska stå lika med Stripe-katalogen i catso-backend
 * (scripts/stripe-catalog.mjs), så ändra båda.
 */

export type PlanId = 'dack' | 'verkstad';
export type Period = 'month' | 'year';

export interface Plan {
	id: PlanId;
	name: string;
	blurb: string;
	/** Kronor per månad. */
	price: number;
	/** Användare som ingår. */
	users: number;
	/** SMS per månad som ingår. */
	sms: number;
}

export const PLANS: Record<PlanId, Plan> = {
	dack: {
		id: 'dack',
		name: 'Däck',
		blurb: 'För dig som lagrar och säljer däck.',
		price: 795,
		users: 2,
		sms: 150,
	},
	verkstad: {
		id: 'verkstad',
		name: 'Verkstad',
		blurb: 'För hela verkstaden, från bokning till bokföring.',
		price: 2495,
		users: 5,
		sms: 300,
	},
};

/** Bilhandel (Hall): fristående, eller som tillägg till Verkstad. */
export const HALL_PRICE = { standalone: 1995, addon: 1495 };
export const EXTRA_USER_PRICE = 99;
export const EXTRA_SCREEN_PRICE = 200;
/** Egen domän faktureras alltid per år. */
export const DOMAIN_YEAR_PRICE = 800;
export const SMS_OVER_PRICE = 1.5;
/** Vår andel av varje kort- eller Swish-betalning via Axle: procent, och högst så många kronor. */
export const PAYMENT_FEE = { percent: 0.5, maxKr: 100 };
export const VAT_RATE = 0.25;
/** Betalar man ett år i taget får man tolv månader för tio. */
export const YEAR_PAID_MONTHS = 10;

export interface Config {
	plan: PlanId;
	/** Alla som ska ha inloggning, inklusive de som ingår i paketet. */
	users: number;
	hall: boolean;
	/** Skärmar utöver den som ingår. Bara Verkstad. */
	screens: number;
	/** Egen domän till bilhandelns webbplats. Kräver bilhandel. */
	domain: boolean;
	period: Period;
	smsPerMonth: number;
	/** Kort- och Swish-betalningar via Axle, kronor per månad. */
	cardVolume: number;
	/** Snitt per betalning i kronor, för taket per betalning. */
	avgPayment: number;
}

export interface Line {
	id: string;
	label: string;
	/** Kronor per månad. Vid årsbetalning är det årspriset delat på tolv. */
	monthly: number;
	note?: string;
}

export interface Quote {
	/** Abonnemanget: paket, bilhandel, användare, skärmar och domän. */
	fixed: Line[];
	/** Det som beror på användningen: SMS över kvoten och betalningsavgiften. */
	usage: Line[];
	fixedMonthly: number;
	usageMonthly: number;
	totalMonthly: number;
	totalInclVat: number;
	/** Det abonnemanget kostar per år när man betalar årsvis, annars 0. */
	yearlyInvoice: number;
}

const round = (n: number): number => Math.round(n);

export function quote(c: Config): Quote {
	const plan = PLANS[c.plan];
	const yearly = c.period === 'year';
	const extraUsers = Math.max(c.users, plan.users) - plan.users;
	const screens = c.plan === 'verkstad' ? Math.max(c.screens, 0) : 0;
	const domain = c.hall && c.domain;

	// [id, text, pris per månad, anmärkning]
	const items: [string, string, number, string?][] = [['plan', `Axle ${plan.name}`, plan.price]];
	if (c.hall) {
		const addon = c.plan === 'verkstad';
		items.push([
			'hall',
			'Bilhandel (Hall)',
			addon ? HALL_PRICE.addon : HALL_PRICE.standalone,
			addon ? 'Tillägg till Verkstad' : undefined,
		]);
	}
	if (extraUsers > 0) {
		items.push(['users', `${extraUsers} extra användare`, extraUsers * EXTRA_USER_PRICE]);
	}
	if (screens > 0) {
		items.push([
			'screens',
			`${screens} extra ${screens === 1 ? 'skärm' : 'skärmar'}`,
			screens * EXTRA_SCREEN_PRICE,
		]);
	}

	const fixed: Line[] = items.map(([id, label, price, note]) => ({
		id,
		label,
		note,
		monthly: round(yearly ? (price * YEAR_PAID_MONTHS) / 12 : price),
	}));
	if (domain) {
		fixed.push({
			id: 'domain',
			label: 'Egen domän',
			note: `${DOMAIN_YEAR_PRICE} kr per år`,
			monthly: round(DOMAIN_YEAR_PRICE / 12),
		});
	}
	const yearlyInvoice = yearly
		? items.reduce((sum, [, , price]) => sum + price * YEAR_PAID_MONTHS, 0) +
			(domain ? DOMAIN_YEAR_PRICE : 0)
		: 0;

	const usage: Line[] = [];
	const smsOver = Math.max(c.smsPerMonth - plan.sms, 0);
	if (smsOver > 0) {
		usage.push({
			id: 'sms',
			label: `SMS över kvoten (${smsOver} st)`,
			note: `${plan.sms} SMS ingår`,
			monthly: round(smsOver * SMS_OVER_PRICE),
		});
	}
	if (c.cardVolume > 0) {
		const avg = Math.max(c.avgPayment, 1);
		const perPayment = Math.min((avg * PAYMENT_FEE.percent) / 100, PAYMENT_FEE.maxKr);
		usage.push({
			id: 'payments',
			label: 'Betalningsavgift',
			note: `${String(PAYMENT_FEE.percent).replace('.', ',')} % per betalning, högst ${PAYMENT_FEE.maxKr} kr`,
			monthly: round((c.cardVolume / avg) * perPayment),
		});
	}

	const fixedMonthly = fixed.reduce((sum, l) => sum + l.monthly, 0);
	const usageMonthly = usage.reduce((sum, l) => sum + l.monthly, 0);
	const totalMonthly = fixedMonthly + usageMonthly;
	return {
		fixed,
		usage,
		fixedMonthly,
		usageMonthly,
		totalMonthly,
		totalInclVat: round(totalMonthly * (1 + VAT_RATE)),
		yearlyInvoice,
	};
}

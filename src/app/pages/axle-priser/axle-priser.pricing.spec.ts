import { quote, type Config } from './axle-priser.pricing';

const base: Config = {
	plan: 'verkstad',
	users: 5,
	hall: false,
	screens: 0,
	domain: false,
	period: 'month',
	smsPerMonth: 0,
	cardVolume: 0,
	avgPayment: 2500,
};

describe('quote', () => {
	it('prices Verkstad alone', () => {
		const q = quote(base);
		expect(q.totalMonthly).toBe(2495);
		expect(q.totalInclVat).toBe(3119);
		expect(q.usage).toEqual([]);
	});

	it('prices Däck alone', () => {
		expect(quote({ ...base, plan: 'dack', users: 2 }).totalMonthly).toBe(795);
	});

	it('charges for users above the included ones, never below', () => {
		expect(quote({ ...base, users: 8 }).totalMonthly).toBe(2495 + 3 * 99);
		expect(quote({ ...base, users: 1 }).totalMonthly).toBe(2495);
	});

	it('gives Hall the add-on price with Verkstad and the standalone price otherwise', () => {
		expect(quote({ ...base, hall: true }).totalMonthly).toBe(2495 + 1495);
		expect(quote({ ...base, plan: 'dack', users: 2, hall: true }).totalMonthly).toBe(795 + 1995);
	});

	it('ignores screens on Däck and a domain without Hall', () => {
		expect(quote({ ...base, plan: 'dack', users: 2, screens: 3 }).totalMonthly).toBe(795);
		expect(quote({ ...base, domain: true }).totalMonthly).toBe(2495);
	});

	it('prices the customer who runs everything', () => {
		const q = quote({
			...base,
			users: 8,
			hall: true,
			screens: 1,
			domain: true,
			smsPerMonth: 500,
			cardVolume: 200000,
		});
		expect(q.fixedMonthly).toBe(2495 + 1495 + 297 + 200 + 67);
		expect(q.usageMonthly).toBe(300 + 1000);
		expect(q.totalMonthly).toBe(5854);
		expect(q.totalInclVat).toBe(7318);
	});

	it('bills ten months for twelve when paying yearly, but the domain stays at its yearly price', () => {
		const q = quote({ ...base, hall: true, domain: true, period: 'year' });
		expect(q.yearlyInvoice).toBe(24950 + 14950 + 800);
		expect(q.fixed.find((l) => l.id === 'plan')?.monthly).toBe(2079);
		expect(q.fixed.find((l) => l.id === 'domain')?.monthly).toBe(67);
	});

	it('charges SMS only above the included quota', () => {
		expect(quote({ ...base, smsPerMonth: 300 }).usage).toEqual([]);
		expect(quote({ ...base, plan: 'dack', users: 2, smsPerMonth: 250 }).usageMonthly).toBe(150);
	});

	it('caps the payment fee per payment', () => {
		const small = quote({ ...base, cardVolume: 100000, avgPayment: 2500 });
		expect(small.usageMonthly).toBe(500);
		const cars = quote({ ...base, cardVolume: 300000, avgPayment: 150000 });
		expect(cars.usageMonthly).toBe(200);
	});

	it('does not divide by zero when the average payment is missing', () => {
		expect(quote({ ...base, cardVolume: 1000, avgPayment: 0 }).usageMonthly).toBe(5);
	});
});

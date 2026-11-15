import { cartTotals, kr, orgNoDigits } from './axle-butik.logic';

describe('cartTotals', () => {
	const printer = { priceMinor: 549_500, shippingMinor: 9_900, vatRate: 25, quantity: 1 };

	it('lägger moms på varor och frakt', () => {
		const t = cartTotals([printer]);
		expect(t.netMinor).toBe(559_400);
		expect(t.totalMinor).toBe(686_875 + 12_375);
		expect(t.vatMinor).toBe(t.totalMinor - t.netMinor);
	});

	it('räknar varje styck för sig, som servern', () => {
		expect(cartTotals([{ priceMinor: 1, shippingMinor: 0, vatRate: 25, quantity: 3 }]).totalMinor).toBe(3);
	});

	it('en tom varukorg kostar inget', () => {
		expect(cartTotals([]).totalMinor).toBe(0);
	});
});

describe('kr', () => {
	it('skriver hela kronor utan ören och annars med två', () => {
		expect(kr(549_500).replace(/\s/g, ' ')).toBe('5 495 kr');
		expect(kr(686_875).replace(/\s/g, ' ')).toBe('6 868,75 kr');
		expect(kr(699_250).replace(/\s/g, ' ')).toBe('6 992,50 kr');
		expect(kr(5).replace(/\s/g, ' ')).toBe('0,05 kr');
	});
});

describe('orgNoDigits', () => {
	it('tar de vanliga skrivsätten', () => {
		expect(orgNoDigits('556012-5790')).toBe('5560125790');
		expect(orgNoDigits('5560125790')).toBe('5560125790');
		expect(orgNoDigits('SE556012579001')).toBe('5560125790');
	});

	it('nekar fel kontrollsiffra och skräp', () => {
		expect(orgNoDigits('556012-5791')).toBeNull();
		expect(orgNoDigits('abc')).toBeNull();
		expect(orgNoDigits('')).toBeNull();
	});
});

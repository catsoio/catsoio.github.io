import { priceCheck, toMinor } from './admin-shop.component';

describe('toMinor', () => {
	it('tar kronor med mellanslag och komma', () => {
		expect(toMinor('4 495')).toBe(449_500);
		expect(toMinor('2760,50')).toBe(276_050);
	});

	it('nekar text och tomt', () => {
		expect(toMinor('')).toBeNull();
		expect(toMinor('abc')).toBeNull();
		expect(toMinor('-5')).toBeNull();
	});
});

describe('priceCheck', () => {
	it('räknar moms och vinst på skrivaren', () => {
		const c = priceCheck('4495', '2760', 25)!;
		expect(c.grossMinor).toBe(561_875);
		expect(c.marginMinor).toBe(173_500);
		expect(c.marginPercent).toBe(39);
	});

	it('visar ingen vinst utan inköpspris', () => {
		const c = priceCheck('4495', '', 25)!;
		expect(c.grossMinor).toBe(561_875);
		expect(c.marginMinor).toBeNull();
		expect(c.marginPercent).toBeNull();
	});

	it('visar förlust när priset ligger under inköpspriset', () => {
		expect(priceCheck('2000', '2760', 25)!.marginMinor).toBe(-76_000);
	});

	it('säger inget utan pris', () => {
		expect(priceCheck('', '2760', 25)).toBeNull();
		expect(priceCheck('0', '2760', 25)).toBeNull();
	});
});

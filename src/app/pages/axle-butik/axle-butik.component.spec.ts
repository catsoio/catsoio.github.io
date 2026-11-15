import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShopApi, type ShopProduct } from './axle-butik.api';
import { AxleButikComponent } from './axle-butik.component';

const printer: ShopProduct = {
	id: 'p1',
	name: 'Etikettskrivare ZD421',
	description: 'Skriver etiketter.',
	category: 'printer',
	image: null,
	priceMinor: 549_500,
	shippingMinor: 9_900,
	vatRate: 25,
	priceInclVatMinor: 686_875,
	maxQuantity: 2,
};

const text = (el: HTMLElement): string => (el.textContent ?? '').replace(/\s+/g, ' ').replace(/ /g, ' ');

describe('AxleButikComponent', () => {
	let api: jasmine.SpyObj<ShopApi>;
	let fixture: ComponentFixture<AxleButikComponent>;
	let component: AxleButikComponent;
	let went: string[];

	const setup = async (products: ShopProduct[]) => {
		api.products.and.resolveTo(products);
		fixture = TestBed.createComponent(AxleButikComponent);
		component = fixture.componentInstance;
		went = [];
		(component as unknown as { go: (u: string) => void }).go = (u) => went.push(u);
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	};

	const click = (label: string) => {
		const button = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
			(b) => (b as HTMLElement).getAttribute('aria-label') === label,
		) as HTMLButtonElement;
		button.click();
		fixture.detectChanges();
	};

	const fillForm = () =>
		component.form.patchValue({
			workshop: 'Verkstan AB',
			orgNo: '556012-5790',
			contactName: 'Anna',
			email: 'anna@example.com',
			phone: '0701234567',
			addressLine1: 'Gatan 1',
			postalCode: '111 22',
			city: 'Stad',
			acceptedTerms: true,
		});

	beforeEach(async () => {
		localStorage.removeItem('catso.axle.butik.v1');
		api = jasmine.createSpyObj<ShopApi>('ShopApi', ['products', 'createOrder', 'order']);
		await TestBed.configureTestingModule({
			imports: [AxleButikComponent],
			providers: [provideRouter([]), { provide: ShopApi, useValue: api }],
		}).compileComponents();
	});

	afterEach(() => localStorage.removeItem('catso.axle.butik.v1'));

	it('visar varorna med pris exkl. moms', async () => {
		await setup([printer]);
		const t = text(fixture.nativeElement);
		expect(t).toContain('Etikettskrivare ZD421');
		expect(t).toContain('5 495 kr');
		expect(t).toContain('exkl. moms');
		expect(t).toContain('Inga varor valda än');
	});

	it('räknar summan med moms och frakt när man lägger en vara i korgen', async () => {
		await setup([printer]);
		click('Fler');
		const t = text(fixture.nativeElement);
		expect(t).toContain('1 × Etikettskrivare ZD421');
		// 5 495 + 99 frakt exkl. moms = 5 594 kr, moms 1 398,50 kr.
		expect(t).toContain('Summa exkl. moms5 594 kr');
		expect(t).toContain('Moms1 398,50 kr');
		expect(t).toContain('Att betala6 992,50 kr');
	});

	it('går inte att beställa fler än butiken tillåter', async () => {
		await setup([printer]);
		click('Fler');
		click('Fler');
		expect(component.have(printer)).toBe(2);
		const plus = fixture.nativeElement.querySelector('button[aria-label="Fler"]') as HTMLButtonElement;
		expect(plus.disabled).toBeTrue();
	});

	it('skickar ingen order med ofullständiga uppgifter', async () => {
		await setup([printer]);
		click('Fler');
		await component.submit();
		fixture.detectChanges();
		expect(api.createOrder).not.toHaveBeenCalled();
		expect(component.error()).toContain('markerade fälten');
	});

	it('skickar inget utan varor', async () => {
		await setup([printer]);
		fillForm();
		await component.submit();
		expect(api.createOrder).not.toHaveBeenCalled();
		expect(component.error()).toBe('Välj minst en vara.');
	});

	it('startar betalningen och går till Stripe med bara varor och antal, aldrig priser', async () => {
		api.createOrder.and.resolveTo({ number: 'CS-00001', token: 't', checkoutUrl: 'https://checkout.stripe.test/x' });
		await setup([printer]);
		click('Fler');
		fillForm();
		await component.submit();
		expect(api.createOrder).toHaveBeenCalledTimes(1);
		const sent = api.createOrder.calls.mostRecent().args[0];
		expect(sent.items).toEqual([{ productId: 'p1', quantity: 1 }]);
		expect(JSON.stringify(sent)).not.toContain('549500');
		expect(went).toEqual(['https://checkout.stripe.test/x']);
	});

	it('visar serverns besked när ordern nekas', async () => {
		api.createOrder.and.rejectWith({
			error: { error: { code: 'INVALID_SHOP_ORDER', message: 'Organisationsnumret stämmer inte.' } },
		});
		await setup([printer]);
		click('Fler');
		fillForm();
		await component.submit();
		expect(component.error()).toBe('Organisationsnumret stämmer inte.');
		expect(went).toEqual([]);
		expect(component.sending()).toBeFalse();
	});

	it('en tom butik säger att den öppnar snart', async () => {
		await setup([]);
		expect(text(fixture.nativeElement)).toContain('Butiken öppnar snart');
	});

	it('kommer ihåg korgen om kunden backar från betalningen', async () => {
		await setup([printer]);
		click('Fler');
		fixture.destroy();
		await setup([printer]);
		expect(component.have(printer)).toBe(1);
	});
});

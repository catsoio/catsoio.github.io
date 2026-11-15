import { TestBed } from '@angular/core/testing';
import { ButikCheckoutComponent } from './butik-checkout.component';
import { ButikStore } from './butik.store';
import { account, clearButikStorage, printer, setupStore } from './butik.store.spec';

const text = (el: HTMLElement): string => (el.textContent ?? '').replace(/\s+/g, ' ').replace(/ /g, ' ');

async function open(options: Parameters<typeof setupStore>[0] = {}) {
	const s = setupStore(options);
	await s.store.load();
	const fixture = TestBed.createComponent(ButikCheckoutComponent);
	const component = fixture.componentInstance;
	const went: string[] = [];
	(component as unknown as { go: (u: string) => void }).go = (u) => went.push(u);
	fixture.detectChanges();
	return { ...s, fixture, component, went };
}

describe('ButikCheckoutComponent', () => {
	afterEach(clearButikStorage);

	it('säger att korgen är tom och skickar inget', async () => {
		const { fixture } = await open();
		expect(text(fixture.nativeElement)).toContain('Varukorgen är tom');
	});

	it('visar raderna och summan med moms och frakt', async () => {
		const { fixture, store } = await open();
		store.add(printer);
		fixture.detectChanges();
		const t = text(fixture.nativeElement);
		expect(t).toContain('Etikettskrivare');
		expect(t).toContain('Summa exkl. moms4 644 kr');
		expect(t).toContain('Att betala5 805 kr');
	});

	it('uppmanar till inloggning när man inte är inloggad', async () => {
		const { fixture, store } = await open();
		store.add(printer);
		fixture.detectChanges();
		expect(text(fixture.nativeElement)).toContain('Har ni ett Axle-konto?');
	});

	it('fyller i verkstadens och kontaktens uppgifter efter inloggning', async () => {
		const { fixture, store, component } = await open();
		store.add(printer);
		await store.login('anna@example.com', 'x');
		fixture.detectChanges();
		const v = component.form.getRawValue();
		expect(v.workshop).toBe('Verkstan AB');
		expect(v.orgNo).toBe('5560125790');
		expect(v.addressLine1).toBe('Gatan 1');
		expect(v.contactName).toBe('Anna Andersson');
		expect(v.email).toBe('anna@example.com');
		expect(v.phone).toBe('0701234567');
		expect(text(fixture.nativeElement)).toContain('hämtas från ert Axle-konto');
	});

	it('låser verkstadens uppgifter från kontot men lämnar kontaktuppgifterna fria', async () => {
		const { fixture, store, component } = await open();
		store.add(printer);
		component.form.patchValue({ contactName: 'Bertil Berg' });
		await store.login('anna@example.com', 'x');
		fixture.detectChanges();
		for (const key of ['workshop', 'orgNo', 'addressLine1', 'postalCode', 'city']) {
			expect(component.form.get(key)!.disabled).withContext(key).toBeTrue();
		}
		expect(component.form.get('contactName')!.disabled).toBeFalse();
		// Det kunden skrev i ett fritt fält skrivs inte över.
		expect(component.form.getRawValue().contactName).toBe('Bertil Berg');
		expect(component.form.getRawValue().workshop).toBe('Verkstan AB');
	});

	it('släpper och tömmer de låsta fälten när man loggar ut', async () => {
		const { fixture, store, component } = await open();
		store.add(printer);
		await store.login('anna@example.com', 'x');
		fixture.detectChanges();
		store.logout();
		fixture.detectChanges();
		expect(component.form.get('workshop')!.disabled).toBeFalse();
		expect(component.form.getRawValue().workshop).toBe('');
		expect(component.form.getRawValue().postalCode).toBe('');
	});

	it('ett konto med ofullständig adress låser bara det som finns', async () => {
		const { fixture, store, component } = await open({ account: { ...account, city: '', postalCode: '' } });
		store.add(printer);
		await store.login('anna@example.com', 'x');
		fixture.detectChanges();
		expect(component.form.get('addressLine1')!.disabled).toBeTrue();
		expect(component.form.get('city')!.disabled).toBeFalse();
	});

	it('startar betalningen med bara vara och antal och går till Stripe', async () => {
		const { fixture, store, component, api, went } = await open();
		store.add(printer);
		await store.login('anna@example.com', 'x');
		fixture.detectChanges();
		component.form.patchValue({ acceptedTerms: true });
		api.createOrder.and.resolveTo({ number: 'CS-00001', token: 't', checkoutUrl: 'https://checkout.stripe.test/x' });
		await component.submit();
		const sent = api.createOrder.calls.mostRecent().args[0];
		expect(sent.items).toEqual([{ productId: 'p1', quantity: 1 }]);
		expect(JSON.stringify(sent)).not.toContain('449500');
		expect(went).toEqual(['https://checkout.stripe.test/x']);
	});

	it('skickar ingenting med ofullständiga uppgifter', async () => {
		const { fixture, store, component, api } = await open();
		store.add(printer);
		fixture.detectChanges();
		await component.submit();
		expect(api.createOrder).not.toHaveBeenCalled();
		expect(component.error()).toContain('markerade fälten');
	});

	it('visar serverns besked när ordern nekas', async () => {
		const { fixture, store, component, api, went } = await open();
		store.add(printer);
		await store.login('anna@example.com', 'x');
		component.form.patchValue({ acceptedTerms: true });
		fixture.detectChanges();
		api.createOrder.and.rejectWith({ error: { error: { code: 'INVALID_SHOP_ORDER', message: 'Organisationsnumret stämmer inte.' } } });
		await component.submit();
		expect(component.error()).toBe('Organisationsnumret stämmer inte.');
		expect(went).toEqual([]);
	});
});

// Håller TestBed-typen i bruk även när ButikStore bara hämtas indirekt.
export type _Store = ButikStore;

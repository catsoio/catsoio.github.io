import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShopApi, ShopAuthApi, type ShopAccount, type ShopProduct } from './axle-butik.api';
import { ButikStore } from './butik.store';

export const printer: ShopProduct = {
	id: 'p1',
	name: 'Etikettskrivare',
	description: '',
	category: 'printer',
	image: null,
	priceMinor: 449_500,
	compareAtMinor: null,
	shippingMinor: 14_900,
	vatRate: 25,
	priceInclVatMinor: 561_875,
	maxQuantity: 2,
};

export const account: ShopAccount = {
	workshop: 'Verkstan AB',
	orgNo: '5560125790',
	email: 'verkstan@example.com',
	phone: '0812345678',
	addressLine1: 'Gatan 1',
	postalCode: '111 22',
	city: 'Stad',
};

export const clearButikStorage = () => {
	for (const k of ['catso.axle.butik.v2', 'catso.axle.butik.auth.v1', 'catso.axle.butik.form.v1']) localStorage.removeItem(k);
};

export function setupStore(options: { account?: ShopAccount | { status: number }; cart?: Record<string, number> } = {}) {
	clearButikStorage();
	if (options.cart) localStorage.setItem('catso.axle.butik.v2', JSON.stringify(options.cart));
	const api = jasmine.createSpyObj<ShopApi>('ShopApi', ['products', 'createOrder', 'order']);
	api.products.and.resolveTo([printer]);
	const auth = jasmine.createSpyObj<ShopAuthApi>('ShopAuthApi', ['login', 'refresh', 'me', 'account']);
	auth.login.and.resolveTo({
		tokens: { accessToken: 'a', refreshToken: 'r' },
		user: { name: 'Anna Andersson', email: 'anna@example.com', phone: '0701234567' },
	});
	const acc = options.account ?? account;
	if ('status' in acc) auth.account.and.rejectWith({ status: acc.status });
	else auth.account.and.resolveTo(acc);
	TestBed.configureTestingModule({
		providers: [
			provideRouter([]),
			{ provide: ShopApi, useValue: api },
			{ provide: ShopAuthApi, useValue: auth },
		],
	});
	return { api, auth, store: TestBed.inject(ButikStore) };
}

describe('ButikStore', () => {
	afterEach(clearButikStorage);

	it('lägger varor i korgen, räknar summan och stannar vid högsta antal', async () => {
		const { store } = setupStore();
		await store.load();
		store.add(printer);
		store.add(printer);
		store.add(printer);
		expect(store.have(printer)).toBe(2);
		expect(store.count()).toBe(2);
		// 2 × (4 495 + 149) = 9 288 exkl. moms, + 25 % = 11 610
		expect(store.totals().netMinor).toBe(2 * (449_500 + 14_900));
		expect(store.totals().totalMinor).toBe(2 * (561_875 + 18_625));
	});

	it('tar bort en vara ur korgen som inte längre säljs', async () => {
		const { store } = setupStore({ cart: { p1: 1, gone: 3 } });
		await store.load();
		expect(Object.keys(store.cart())).toEqual(['p1']);
		expect(store.lines().length).toBe(1);
	});

	it('loggar in och hämtar verkstadens uppgifter', async () => {
		const { store, auth } = setupStore();
		await store.login('anna@example.com', 'hemligt');
		expect(auth.login).toHaveBeenCalledWith('anna@example.com', 'hemligt');
		expect(store.user()?.name).toBe('Anna Andersson');
		expect(store.account()?.workshop).toBe('Verkstan AB');
		// Lösenordet sparas aldrig, bara tokens.
		expect(localStorage.getItem('catso.axle.butik.auth.v1')).not.toContain('hemligt');
	});

	it('ett konto utan garage är ändå inloggat, med bara kontaktuppgifter', async () => {
		const { store } = setupStore({ account: { status: 403 } });
		await store.login('anna@example.com', 'x');
		expect(store.user()).not.toBeNull();
		expect(store.account()).toBeNull();
	});

	it('loggar ut och glömmer uppgifterna', async () => {
		const { store } = setupStore();
		await store.login('anna@example.com', 'x');
		store.logout();
		expect(store.user()).toBeNull();
		expect(store.account()).toBeNull();
		expect(localStorage.getItem('catso.axle.butik.auth.v1')).toBeNull();
	});
});

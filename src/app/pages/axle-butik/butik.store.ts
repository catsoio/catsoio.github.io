import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ShopApi, ShopAuthApi, type ShopAccount, type ShopProduct, type ShopTokens, type ShopUser } from './axle-butik.api';
import { cartTotals } from './axle-butik.logic';

const CART_KEY = 'catso.axle.butik.v2';
const AUTH_KEY = 'catso.axle.butik.auth.v1';

/**
 * Butikens gemensamma tillstånd för alla dess sidor: varorna, varukorgen och inloggningen.
 * Varukorgen och tokens sparas i webbläsaren; lösenordet sparas aldrig.
 */
@Injectable({ providedIn: 'root' })
export class ButikStore {
	private readonly api = inject(ShopApi);
	private readonly auth = inject(ShopAuthApi);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	private tokens: ShopTokens | null = null;
	private loaded = false;

	readonly products = signal<ShopProduct[]>([]);
	readonly loading = signal(true);
	readonly failed = signal(false);
	/** Antal per vara. */
	readonly cart = signal<Record<string, number>>({});

	readonly user = signal<ShopUser | null>(null);
	/** Företagsuppgifterna från kontots garage, när kontot har ett. */
	readonly account = signal<ShopAccount | null>(null);
	readonly loginOpen = signal(false);

	readonly lines = computed(() =>
		this.products()
			.map((product) => ({ product, quantity: this.cart()[product.id] ?? 0 }))
			.filter((l) => l.quantity > 0),
	);
	readonly count = computed(() => this.lines().reduce((n, l) => n + l.quantity, 0));
	readonly totals = computed(() =>
		cartTotals(
			this.lines().map((l) => ({
				priceMinor: l.product.priceMinor,
				shippingMinor: l.product.shippingMinor,
				vatRate: l.product.vatRate,
				quantity: l.quantity,
			})),
		),
	);

	constructor() {
		this.restore();
		void this.load();
	}

	async load(): Promise<void> {
		if (!this.browser || this.loaded) {
			this.loading.set(false);
			return;
		}
		this.loading.set(true);
		this.failed.set(false);
		try {
			const products = await this.api.products();
			this.products.set(products);
			this.loaded = true;
			// En vara som tagits bort ur butiken ska inte ligga kvar i den sparade korgen.
			const known = new Set(products.map((p) => p.id));
			this.cart.update((q) => Object.fromEntries(Object.entries(q).filter(([id, n]) => known.has(id) && n > 0)));
			this.saveCart();
		} catch {
			this.failed.set(true);
		} finally {
			this.loading.set(false);
		}
		if (this.tokens) void this.loadAccount();
	}

	product(id: string): ShopProduct | undefined {
		return this.products().find((p) => p.id === id);
	}

	have(p: ShopProduct): number {
		return this.cart()[p.id] ?? 0;
	}

	set(p: ShopProduct, quantity: number): void {
		const n = Math.max(0, Math.min(p.maxQuantity, Math.floor(quantity)));
		this.cart.update((q) => ({ ...q, [p.id]: n }));
		this.saveCart();
	}

	add(p: ShopProduct, n = 1): void {
		this.set(p, this.have(p) + n);
	}

	clear(): void {
		this.cart.set({});
		this.saveCart();
	}

	// ---- Inloggning ---------------------------------------------------------------------------

	async login(identifier: string, password: string): Promise<void> {
		const { tokens, user } = await this.auth.login(identifier, password);
		this.tokens = tokens;
		this.user.set(user);
		this.saveAuth();
		this.loginOpen.set(false);
		await this.loadAccount();
	}

	logout(): void {
		this.tokens = null;
		this.user.set(null);
		this.account.set(null);
		this.saveAuth();
	}

	/** Hämtar garagets uppgifter. Ett konto utan garage eller en mekaniker får bara sina kontaktuppgifter. */
	private async loadAccount(): Promise<void> {
		const run = async (token: string) => {
			this.account.set(await this.auth.account(token));
		};
		try {
			if (!this.tokens) return;
			try {
				await run(this.tokens.accessToken);
			} catch (e) {
				const status = (e as { status?: number }).status;
				if (status === 401 && (await this.refresh())) await run(this.tokens!.accessToken);
				else if (status === 401) this.logout();
				// 403 (inget garage) och övriga fel: kontaktuppgifterna räcker.
			}
		} catch {
			this.account.set(null);
		}
	}

	private async refresh(): Promise<boolean> {
		if (!this.tokens) return false;
		try {
			this.tokens = await this.auth.refresh(this.tokens.refreshToken);
			this.saveAuth();
			return true;
		} catch {
			return false;
		}
	}

	// ---- Lagring i webbläsaren ----------------------------------------------------------------

	private saveCart(): void {
		if (!this.browser) return;
		try {
			localStorage.setItem(CART_KEY, JSON.stringify(this.cart()));
		} catch {
			// Utan lagring börjar kunden om efter en omladdning, mer är det inte.
		}
	}

	private saveAuth(): void {
		if (!this.browser) return;
		try {
			if (this.tokens) localStorage.setItem(AUTH_KEY, JSON.stringify({ tokens: this.tokens, user: this.user() }));
			else localStorage.removeItem(AUTH_KEY);
		} catch {
			// Utan lagring loggar kunden in igen efter en omladdning.
		}
	}

	private restore(): void {
		if (!this.browser) return;
		try {
			const cart = localStorage.getItem(CART_KEY);
			if (cart) this.cart.set(JSON.parse(cart) as Record<string, number>);
			const auth = localStorage.getItem(AUTH_KEY);
			if (auth) {
				const saved = JSON.parse(auth) as { tokens: ShopTokens; user: ShopUser | null };
				this.tokens = saved.tokens;
				this.user.set(saved.user);
			}
		} catch {
			// En trasig sparad korg eller inloggning ignoreras.
		}
	}
}

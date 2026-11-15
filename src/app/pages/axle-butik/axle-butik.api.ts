import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environment';

/** En vara som den visas för en besökare. Belopp är hela öre exkl. moms om inget annat sägs. */
export interface ShopProduct {
	id: string;
	name: string;
	description: string;
	category: 'printer' | 'supplies' | 'scanner' | 'terminal' | 'other';
	image: string | null;
	priceMinor: number;
	/** Ordinarie pris att visa överstruket, eller null. */
	compareAtMinor: number | null;
	shippingMinor: number;
	vatRate: number;
	priceInclVatMinor: number;
	maxQuantity: number;
}

export interface ShopOrderRequest {
	items: { productId: string; quantity: number }[];
	workshop: string;
	orgNo: string;
	contactName: string;
	email: string;
	phone: string;
	addressLine1: string;
	addressLine2?: string;
	postalCode: string;
	city: string;
	note?: string;
	acceptedTerms: boolean;
	/** Honeypot. */
	website?: string;
}

export interface CreatedShopOrder {
	number: string;
	token: string;
	checkoutUrl: string;
}

export type ShopOrderStatus =
	| 'awaiting_payment'
	| 'paid'
	| 'ordered'
	| 'shipped'
	| 'delivered'
	| 'canceled'
	| 'expired';

/** Kundens sida om sin order. */
export interface ShopOrderView {
	number: string;
	status: ShopOrderStatus;
	lines: { name: string; quantity: number; unitMinor: number; vatRate: number }[];
	totals: {
		goodsMinor: number;
		shippingMinor: number;
		netMinor: number;
		vatMinor: number;
		totalMinor: number;
	};
	trackingNo: string;
	paidAt: string | null;
	shippedAt: string | null;
	deliveredAt: string | null;
}

/** Butikens publika anrop. Ingen inloggning. */
@Injectable({ providedIn: 'root' })
export class ShopApi {
	private readonly http = inject(HttpClient);
	private readonly base = `${environment.apiBaseUrl}/api/inventory/public/shop`;

	products(): Promise<ShopProduct[]> {
		return firstValueFrom(this.http.get<{ data: ShopProduct[] }>(`${this.base}/products`).pipe(map((r) => r.data)));
	}

	createOrder(body: ShopOrderRequest): Promise<CreatedShopOrder> {
		return firstValueFrom(
			this.http.post<{ data: CreatedShopOrder }>(`${this.base}/orders`, body).pipe(map((r) => r.data)),
		);
	}

	order(token: string): Promise<ShopOrderView> {
		return firstValueFrom(
			this.http.get<{ data: ShopOrderView }>(`${this.base}/orders/${encodeURIComponent(token)}`).pipe(map((r) => r.data)),
		);
	}
}

/** Uppgifter som butiken fyller i åt en inloggad verkstad (Inställningar → Företaget i Axle). */
export interface ShopAccount {
	workshop: string;
	orgNo: string;
	email: string;
	phone: string;
	addressLine1: string;
	postalCode: string;
	city: string;
}

export interface ShopUser {
	name: string | null;
	email: string | null;
	phone: string | null;
}

export interface ShopTokens {
	accessToken: string;
	refreshToken: string;
}

const APP_ID = 'garagestock';

/** Inloggning med ett vanligt Axle-konto. Butiken sparar bara tokens, aldrig lösenordet. */
@Injectable({ providedIn: 'root' })
export class ShopAuthApi {
	private readonly http = inject(HttpClient);
	private readonly base = `${environment.apiBaseUrl}/api`;

	private headers(token?: string): HttpHeaders {
		let h = new HttpHeaders({ 'X-App-Id': APP_ID });
		if (token) h = h.set('Authorization', `Bearer ${token}`);
		return h;
	}

	/** E-post eller mobilnummer plus lösenord, som i Axle-appen. */
	async login(identifier: string, password: string): Promise<{ tokens: ShopTokens; user: ShopUser }> {
		const isEmail = identifier.includes('@');
		const body = isEmail ? { email: identifier.trim(), password } : { phone: identifier.trim(), password };
		const res = await firstValueFrom(
			this.http.post<{ data: { tokens: ShopTokens; user: ShopUser } }>(
				`${this.base}/auth/${isEmail ? 'email/login' : 'login'}`,
				body,
				{ headers: this.headers() },
			),
		);
		return res.data;
	}

	async refresh(refreshToken: string): Promise<ShopTokens> {
		const res = await firstValueFrom(
			this.http.post<{ data: { tokens: ShopTokens } }>(
				`${this.base}/auth/refresh`,
				{ refreshToken },
				{ headers: this.headers() },
			),
		);
		return res.data.tokens;
	}

	async me(token: string): Promise<ShopUser> {
		const res = await firstValueFrom(
			this.http.get<{ data: ShopUser }>(`${this.base}/auth/me`, { headers: this.headers(token) }),
		);
		return res.data;
	}

	/** 403 när kontot saknar garage eller är mekaniker: då fylls bara kontaktuppgifterna i. */
	async account(token: string): Promise<ShopAccount> {
		const res = await firstValueFrom(
			this.http.get<{ data: ShopAccount }>(`${this.base}/inventory/shop/account`, {
				headers: this.headers(token),
			}),
		);
		return res.data;
	}
}

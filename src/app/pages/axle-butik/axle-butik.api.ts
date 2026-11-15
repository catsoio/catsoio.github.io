import { HttpClient } from '@angular/common/http';
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

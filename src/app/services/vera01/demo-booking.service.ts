import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DemoRequest {
	name: string;
	email: string;
	message: string;
	date: string;
	byra: string;
	modules: string[];
}

export interface ContactUsRequest {
	name: string;
	email: string;
	message: string;
	date: string;
	byra: string;
}

export interface ShopifyLeadRequest {
	name: string;
	email: string;
	store: string;
	message: string;
}

@Injectable({ providedIn: 'root' })
export class DemoBookingService {
	private http = inject(HttpClient);
	private base = environment.hemmafestProd; 

	async createDemoRequest(payload: DemoRequest): Promise<void> {
		await firstValueFrom(
			this.http.post<void>(`${this.base}/transfer/new-vera-demo-request`, payload, {
				withCredentials: true,
			})
		);
	}
	
	async contactUsRequest(payload: ContactUsRequest): Promise<void> {
		await firstValueFrom(
			this.http.post<void>(`${this.base}/transfer/contact-us-vera-request`, payload, {
				withCredentials: true,
			})
		);
	}

	/**
	 * Lead från Shopify AI Sök-sidan. Återanvänder samma endpoint som VERA,
	 * men taggar avsändaren så att vi ser var förfrågan kommer ifrån.
	 */
	async createShopifyAiSearchLead(payload: ShopifyLeadRequest): Promise<void> {
		await this.contactUsRequest({
			name: payload.name,
			email: payload.email,
			byra: payload.store,
			message: `[Shopify AI Sök] Butik: ${payload.store}\n\n${payload.message}`,
			date: new Date().toISOString(),
		});
	}
}

export type { DemoRequest as DemoRequestModel };

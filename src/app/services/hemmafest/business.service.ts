import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BusinessInquiryRequest {
	company: string;
	contact_name: string;
	email: string;
	phone?: string;
	package?: string; // 'bas' | 'plus' | 'premium'
	placement?: string; // 'banner' | 'swipe'
	message?: string;
	source?: string;
}

export interface BusinessInquiryResponse {
	ok: boolean;
	id: string;
}

@Injectable({ providedIn: 'root' })
export class BusinessService {
	private readonly backend = environment.production
		? environment.hemmafestProd
		: environment.hemmafestDev;

	constructor(private http: HttpClient) {}

	sendInquiry(payload: BusinessInquiryRequest): Observable<BusinessInquiryResponse> {
		const url = `${this.backend}/ads/business-inquiry`;
		return this.http.post<BusinessInquiryResponse>(url, payload, {
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

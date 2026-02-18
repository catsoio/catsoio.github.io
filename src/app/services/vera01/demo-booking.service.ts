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

@Injectable({ providedIn: 'root' })
export class DemoBookingService {
	private http = inject(HttpClient);
	private base = environment.vera01Dev; 

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
}

export type { DemoRequest as DemoRequestModel };

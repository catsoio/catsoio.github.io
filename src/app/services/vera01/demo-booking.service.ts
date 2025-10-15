import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DemoRequest {
	name: string;
	email: string;
	firm: string;
	message: string;
}

@Injectable({ providedIn: 'root' })
export class DemoBookingService {
	private http = inject(HttpClient);
	private base = environment.apiBaseUrl; // e.g. 'https://api.catso.io'

	async createDemoRequest(payload: DemoRequest): Promise<void> {
		await firstValueFrom(
			this.http.post<void>(`${this.base}/demo-bookings`, payload, {
				withCredentials: true,
			})
		);
	}
}

export type { DemoRequest as DemoRequestModel };

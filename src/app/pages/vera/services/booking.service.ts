import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BookingRequest {
	name: string;
	email: string;
	message?: string;
}

export interface BookingResponse {
	id: string;
	status: 'received' | 'scheduled';
}

@Injectable({ providedIn: 'root' })
export class BookingService {
	private base = environment.apiBaseUrl;

	constructor(private http: HttpClient) {}

	createBooking(data: BookingRequest): Observable<BookingResponse> {
		return this.http.post<BookingResponse>(
			`${this.base}/api/demo-bookings`,
			data,
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}

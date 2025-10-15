import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DeleteAccountRequest {
	email: string;
	reason?: string;
	consent: boolean; // must be true
	userId?: string; // your internal id (optional)
	platform?: 'ios' | 'android' | 'web';
	appVersion?: string;
	locale?: string;
	userAgent?: string;
}

export interface DeleteAccountResponse {
	id: string; // request id returned by backend
	status: 'received' | 'queued'; // adjust to your API
}

@Injectable({ providedIn: 'root' })
export class UsersService {
	private readonly backend = environment.production
		? environment.hemmafestProd
		: environment.hemmafestDev;

	constructor(private http: HttpClient) {}

	requestDeleteAccount(payload: DeleteAccountRequest): Observable<DeleteAccountResponse> {
		const url = `${this.backend}/auth/users/request-delete-account`;
		return this.http.post<DeleteAccountResponse>(url, payload, {
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

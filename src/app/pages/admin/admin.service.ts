import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, isDevMode, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, firstValueFrom, map, throwError } from 'rxjs';

export type PlanId = 'dack' | 'verkstad';
export type SubStatus = 'trialing' | 'active' | 'past_due' | 'canceled';
export type AccessState = 'trial' | 'subscribed' | 'past_due' | 'trial_expired' | 'canceled';

export interface AdminSubscription {
	state: AccessState;
	plan: PlanId;
	status: SubStatus;
	trialEndsAt: string;
	trialDaysLeft: number;
	currentPeriodEnd: string | null;
	cancelAtPeriodEnd: boolean;
	extraSeats: number;
	hasStripe: boolean;
}

export interface AdminGarage {
	id: string;
	name: string;
	createdAt: string;
	memberCount: number;
	owner: { name: string | null; email: string | null; phone: string | null } | null;
	lastSeenAt: string | null;
	subscription: AdminSubscription | null;
}

export interface LicenseChange {
	plan?: PlanId;
	status?: SubStatus;
	extraSeats?: number;
	trialEndsAt?: string;
	licenseUntil?: string;
}

export interface PlanInfo {
	id: PlanId;
	name: string;
	blurb: string;
	features: string[];
	priceMinor: number;
	includedUsers: number;
}

export interface PlanCatalog {
	extraUserPriceMinor: number;
	plans: PlanInfo[];
}

export interface PlanCatalogChange {
	extraUserPriceMinor?: number;
	plans?: Partial<Record<PlanId, { name?: string; blurb?: string; priceMinor?: number; features?: string[] }>>;
}

interface Tokens {
	accessToken: string;
	refreshToken: string;
}

const KEY = 'catso.admin.tokens';
const APP_ID = 'garagestock';

/** Talks to the Catso backend as a platform operator. Tokens live in sessionStorage only. */
@Injectable({ providedIn: 'root' })
export class AdminService {
	private readonly http = inject(HttpClient);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly base = isDevMode() ? 'http://localhost:3000/api' : 'https://api.catso.io/api';
	private readonly tokens = signal<Tokens | null>(this.load());

	readonly loggedIn = computed(() => this.tokens() !== null);

	private load(): Tokens | null {
		if (!this.browser) return null;
		try {
			return JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
		} catch {
			return null;
		}
	}

	private store(t: Tokens | null) {
		this.tokens.set(t);
		if (!this.browser) return;
		try {
			if (t) sessionStorage.setItem(KEY, JSON.stringify(t));
			else sessionStorage.removeItem(KEY);
		} catch {
			// Without sessionStorage the operator simply logs in again after a reload.
		}
	}

	private headers(auth: boolean): HttpHeaders {
		let h = new HttpHeaders({ 'X-App-Id': APP_ID });
		const t = this.tokens();
		if (auth && t) h = h.set('Authorization', `Bearer ${t.accessToken}`);
		return h;
	}

	/** Unwraps the backend's `{ success, data }` envelope. */
	private unwrap<T>(source: Observable<{ data?: T } & Record<string, unknown>>): Observable<T> {
		return source.pipe(map((r) => ('success' in r ? (r['data'] as T) : (r as unknown as T))));
	}

	async login(email: string, password: string): Promise<void> {
		const res = await firstValueFrom(
			this.unwrap<{ tokens: Tokens }>(
				this.http.post<any>(`${this.base}/auth/email/login`, { email, password }, { headers: this.headers(false) }),
			),
		);
		this.store({ accessToken: res.tokens.accessToken, refreshToken: res.tokens.refreshToken });
	}

	async logout(): Promise<void> {
		const t = this.tokens();
		this.store(null);
		if (t) {
			this.http
				.post(`${this.base}/auth/logout`, { refreshToken: t.refreshToken }, { headers: this.headers(false) })
				.subscribe({ error: () => {} });
		}
	}

	private async refresh(): Promise<boolean> {
		const t = this.tokens();
		if (!t) return false;
		try {
			const res = await firstValueFrom(
				this.unwrap<{ tokens: Tokens }>(
					this.http.post<any>(`${this.base}/auth/refresh`, { refreshToken: t.refreshToken }, { headers: this.headers(false) }),
				),
			);
			this.store({ accessToken: res.tokens.accessToken, refreshToken: res.tokens.refreshToken });
			return true;
		} catch {
			this.store(null);
			return false;
		}
	}

	/** An authenticated call that refreshes the session once if the access token has expired. */
	private async call<T>(make: () => Observable<any>): Promise<T> {
		const run = () => firstValueFrom(this.unwrap<T>(make()).pipe(catchError((e: HttpErrorResponse) => throwError(() => e))));
		try {
			return await run();
		} catch (e) {
			if ((e as HttpErrorResponse).status === 401 && (await this.refresh())) return run();
			throw e;
		}
	}

	/** Whether the logged-in account is a platform operator. */
	async isOperator(): Promise<boolean> {
		const me = await this.call<{ superAdmin?: boolean }>(() =>
			this.http.get<any>(`${this.base}/inventory/garage`, { headers: this.headers(true) }),
		);
		return !!me.superAdmin;
	}

	garages(): Promise<AdminGarage[]> {
		return this.call(() =>
			this.http.get<any>(`${this.base}/inventory/garage/admin/overview`, { headers: this.headers(true) }),
		);
	}

	setLicense(garageId: string, change: LicenseChange): Promise<unknown> {
		return this.call(() =>
			this.http.put<any>(`${this.base}/inventory/garage/${garageId}/license`, change, {
				headers: this.headers(true),
			}),
		);
	}

	plans(): Promise<PlanCatalog> {
		return this.call(() => this.http.get<any>(`${this.base}/inventory/plans`, { headers: this.headers(true) }));
	}

	savePlans(change: PlanCatalogChange): Promise<PlanCatalog> {
		return this.call(() =>
			this.http.put<any>(`${this.base}/inventory/plans`, change, { headers: this.headers(true) }),
		);
	}
}

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	AccessState,
	AdminGarage,
	AdminService,
	LicenseChange,
	PlanCatalog,
	PlanId,
	SubStatus,
} from './admin.service';

type Filter = 'all' | 'trial' | 'expiring' | 'paying' | 'blocked';

/** Fallback until the catalog has loaded. The backend catalog is the source of truth for display. */
const DEFAULT_PRICE: Record<PlanId, number> = { dack: 495, verkstad: 1295 };
const DAY = 86_400_000;

const STATE_LABEL: Record<AccessState, string> = {
	trial: 'Provperiod',
	subscribed: 'Betalande',
	past_due: 'Betalning saknas',
	trial_expired: 'Prov slut',
	canceled: 'Avslutad',
};
const STATE_CLASS: Record<AccessState, string> = {
	trial: 'bg-sky-500/15 text-sky-300',
	subscribed: 'bg-emerald-500/15 text-emerald-300',
	past_due: 'bg-amber-500/15 text-amber-300',
	trial_expired: 'bg-red-500/15 text-red-300',
	canceled: 'bg-neutral-500/20 text-neutral-300',
};

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

@Component({
	selector: 'app-admin',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
	private readonly api = inject(AdminService);

	readonly loggedIn = this.api.loggedIn;
	readonly email = signal('');
	readonly password = signal('');
	readonly error = signal('');
	readonly busy = signal(false);

	readonly garages = signal<AdminGarage[]>([]);
	readonly loading = signal(false);
	readonly query = signal('');
	readonly filter = signal<Filter>('all');
	readonly selected = signal<AdminGarage | null>(null);

	// Edit form
	plan: PlanId = 'verkstad';
	status: SubStatus = 'trialing';
	extraSeats = 0;
	trialEnds = '';
	licenseUntil = '';
	readonly saving = signal(false);
	readonly saveError = signal('');

	// Plan catalog editor
	readonly catalog = signal<PlanCatalog | null>(null);
	readonly showPlans = signal(false);
	readonly planSaving = signal(false);
	readonly planMsg = signal('');
	planForms: Record<PlanId, { name: string; blurb: string; price: number; features: string }> = {
		dack: { name: '', blurb: '', price: 0, features: '' },
		verkstad: { name: '', blurb: '', price: 0, features: '' },
	};
	extraUserPrice = 0;

	readonly filters: { id: Filter; label: string }[] = [
		{ id: 'all', label: 'Alla' },
		{ id: 'trial', label: 'Provperiod' },
		{ id: 'expiring', label: 'Går ut snart' },
		{ id: 'paying', label: 'Betalande' },
		{ id: 'blocked', label: 'Spärrade' },
	];
	readonly plans: PlanId[] = ['dack', 'verkstad'];
	readonly statuses: { id: SubStatus; label: string }[] = [
		{ id: 'trialing', label: 'Provperiod' },
		{ id: 'active', label: 'Aktiv' },
		{ id: 'past_due', label: 'Betalning saknas' },
		{ id: 'canceled', label: 'Avslutad' },
	];

	readonly stats = computed(() => {
		const all = this.garages();
		const sub = (g: AdminGarage) => g.subscription;
		const paying = all.filter((g) => sub(g)?.state === 'subscribed' || sub(g)?.state === 'past_due');
		const mrr = paying.reduce((sum, g) => {
			const s = sub(g)!;
			const price = this.catalog()?.plans.find((p) => p.id === s.plan)?.priceMinor;
			const extra = this.catalog()?.extraUserPriceMinor ?? 9900;
			return sum + (price !== undefined ? price / 100 : DEFAULT_PRICE[s.plan]) + (s.extraSeats * extra) / 100;
		}, 0);
		return {
			total: all.length,
			trial: all.filter((g) => sub(g)?.state === 'trial').length,
			expiring: all.filter((g) => this.expiring(g)).length,
			paying: paying.length,
			blocked: all.filter((g) => this.blocked(g)).length,
			mrr,
		};
	});

	readonly shown = computed(() => {
		const q = this.query().trim().toLowerCase();
		const f = this.filter();
		return this.garages().filter((g) => {
			if (q) {
				const hay = `${g.name} ${g.owner?.email ?? ''} ${g.owner?.name ?? ''} ${g.owner?.phone ?? ''}`.toLowerCase();
				if (!hay.includes(q)) return false;
			}
			const s = g.subscription?.state;
			switch (f) {
				case 'trial':
					return s === 'trial' || !g.subscription;
				case 'expiring':
					return this.expiring(g);
				case 'paying':
					return s === 'subscribed' || s === 'past_due';
				case 'blocked':
					return this.blocked(g);
				default:
					return true;
			}
		});
	});

	ngOnInit() {
		if (this.loggedIn()) void this.load();
	}

	expiring(g: AdminGarage): boolean {
		const s = g.subscription;
		return !!s && s.state === 'trial' && s.trialDaysLeft <= 7;
	}

	blocked(g: AdminGarage): boolean {
		const s = g.subscription?.state;
		return s === 'trial_expired' || s === 'canceled';
	}

	stateLabel(g: AdminGarage): string {
		return g.subscription ? STATE_LABEL[g.subscription.state] : 'Ingen provperiod än';
	}

	stateClass(g: AdminGarage): string {
		return g.subscription ? STATE_CLASS[g.subscription.state] : 'bg-neutral-500/20 text-neutral-300';
	}

	planLabel(p: PlanId): string {
		return p === 'dack' ? 'Däck' : 'Verkstad';
	}

	date(iso: string | null | undefined): string {
		return iso ? new Date(iso).toLocaleDateString('sv-SE') : '–';
	}

	ago(iso: string | null): string {
		if (!iso) return 'aldrig';
		const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
		if (days <= 0) return 'idag';
		return days === 1 ? 'igår' : `${days} dagar sedan`;
	}

	endLabel(g: AdminGarage): string {
		const s = g.subscription;
		if (!s) return '–';
		if (s.state === 'trial') return `${this.date(s.trialEndsAt)} (${s.trialDaysLeft} d kvar)`;
		if (s.state === 'trial_expired') return `Gick ut ${this.date(s.trialEndsAt)}`;
		return s.currentPeriodEnd ? `Förnyas ${this.date(s.currentPeriodEnd)}` : '–';
	}

	async signIn() {
		this.error.set('');
		this.busy.set(true);
		try {
			await this.api.login(this.email().trim(), this.password());
			this.password.set('');
			await this.load();
		} catch (e) {
			const status = (e as HttpErrorResponse).status;
			this.error.set(status === 401 || status === 400 ? 'Fel e-post eller lösenord.' : 'Kunde inte nå servern.');
		} finally {
			this.busy.set(false);
		}
	}

	async load() {
		this.loading.set(true);
		this.error.set('');
		try {
			if (!(await this.api.isOperator())) {
				this.error.set('Kontot saknar behörighet till adminpanelen.');
				await this.api.logout();
				return;
			}
			this.garages.set(await this.api.garages());
			this.applyCatalog(await this.api.plans());
			const sel = this.selected();
			if (sel) this.selected.set(this.garages().find((g) => g.id === sel.id) ?? null);
		} catch (e) {
			const status = (e as HttpErrorResponse).status;
			if (status === 401) await this.api.logout();
			else this.error.set(status === 403 ? 'Kontot saknar behörighet.' : 'Kunde inte hämta kunderna.');
		} finally {
			this.loading.set(false);
		}
	}

	signOut() {
		void this.api.logout();
		this.garages.set([]);
		this.selected.set(null);
	}

	open(g: AdminGarage) {
		this.selected.set(g);
		this.saveError.set('');
		const s = g.subscription;
		this.plan = s?.plan ?? 'verkstad';
		this.status = s?.status ?? 'trialing';
		this.extraSeats = s?.extraSeats ?? 0;
		this.trialEnds = s ? isoDay(new Date(s.trialEndsAt)) : '';
		this.licenseUntil = s?.currentPeriodEnd ? isoDay(new Date(s.currentPeriodEnd)) : '';
	}

	close() {
		this.selected.set(null);
	}

	/** Pushes the trial end forward from today or from its current end, whichever is later. */
	extendTrial(days: number) {
		const current = this.trialEnds ? new Date(this.trialEnds).getTime() : 0;
		const from = Math.max(Date.now(), current);
		this.trialEnds = isoDay(new Date(from + days * DAY));
		this.status = 'trialing';
	}

	async save() {
		const g = this.selected();
		if (!g) return;
		const change: LicenseChange = {
			plan: this.plan,
			status: this.status,
			extraSeats: Number(this.extraSeats) || 0,
		};
		if (this.trialEnds) change.trialEndsAt = new Date(`${this.trialEnds}T23:59:59`).toISOString();
		if (this.licenseUntil) change.licenseUntil = new Date(`${this.licenseUntil}T23:59:59`).toISOString();
		this.saving.set(true);
		this.saveError.set('');
		try {
			await this.api.setLicense(g.id, change);
			await this.load();
			this.close();
		} catch {
			this.saveError.set('Kunde inte spara. Kontrollera uppgifterna och försök igen.');
		} finally {
			this.saving.set(false);
		}
	}

	private applyCatalog(c: PlanCatalog) {
		this.catalog.set(c);
		for (const p of c.plans) {
			this.planForms[p.id] = {
				name: p.name,
				blurb: p.blurb,
				price: p.priceMinor / 100,
				features: p.features.join('\n'),
			};
		}
		this.extraUserPrice = c.extraUserPriceMinor / 100;
	}

	async savePlans() {
		this.planSaving.set(true);
		this.planMsg.set('');
		try {
			const plans: Record<string, unknown> = {};
			for (const id of this.plans) {
				const f = this.planForms[id];
				plans[id] = {
					name: f.name.trim(),
					blurb: f.blurb.trim(),
					priceMinor: Math.round(Number(f.price) * 100),
					features: f.features.split('\n').map((l) => l.trim()).filter(Boolean),
				};
			}
			const res = await this.api.savePlans({
				extraUserPriceMinor: Math.round(Number(this.extraUserPrice) * 100),
				plans: plans as never,
			});
			this.applyCatalog(res);
			this.planMsg.set('Sparat. Landingpagen visar de nya uppgifterna direkt.');
		} catch {
			this.planMsg.set('Kunde inte spara. Kontrollera uppgifterna.');
		} finally {
			this.planSaving.set(false);
		}
	}
}

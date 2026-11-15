import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, effect, inject, signal, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShopApi } from './axle-butik.api';
import { kr, orgNoDigits } from './axle-butik.logic';
import { ButikFrameComponent } from './butik-frame.component';
import { ButikVisualComponent } from './butik-visual.component';
import { ButikStore } from './butik.store';

/** Uppgifterna sparas här, så de finns kvar om kunden avbryter betalningen. */
const FORM_KEY = 'catso.axle.butik.form.v1';

const orgNoValidator = (c: AbstractControl): ValidationErrors | null =>
	orgNoDigits(String(c.value ?? '')) ? null : { orgNo: true };

/**
 * Varukorg och kassa på en sida. Är kunden inloggad med ett Axle-konto fylls verkstadens uppgifter i
 * ur kontot (bara fält som är tomma, och allt går att ändra). Det som dras på kortet räknar servern om
 * och bestämmer, aldrig den här sidan.
 */
@Component({
	selector: 'app-butik-checkout',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ReactiveFormsModule, ButikFrameComponent, ButikVisualComponent],
	templateUrl: './butik-checkout.component.html',
	styleUrl: './axle-butik.component.scss',
})
export class ButikCheckoutComponent {
	readonly store = inject(ButikStore);
	private readonly api = inject(ShopApi);
	private readonly fb = inject(FormBuilder);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	readonly kr = kr;

	readonly form = this.fb.nonNullable.group({
		workshop: ['', [Validators.required, Validators.maxLength(160)]],
		orgNo: ['', [Validators.required, orgNoValidator]],
		contactName: ['', [Validators.required, Validators.maxLength(120)]],
		email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
		phone: ['', [Validators.required, Validators.maxLength(40)]],
		addressLine1: ['', [Validators.required, Validators.maxLength(160)]],
		addressLine2: ['', [Validators.maxLength(160)]],
		postalCode: ['', [Validators.required, Validators.pattern(/^\d{3}\s?\d{2}$/)]],
		city: ['', [Validators.required, Validators.maxLength(80)]],
		note: ['', [Validators.maxLength(1000)]],
		acceptedTerms: [false, [Validators.requiredTrue]],
		website: [''], // honeypot, ska förbli tom
	});
	/** Fälten som kommer från Axle-kontot och är låsta. */
	readonly locked = signal<Set<string>>(new Set());
	readonly submitted = signal(false);
	readonly sending = signal(false);
	readonly error = signal('');

	constructor() {
		this.restore();
		this.form.valueChanges.subscribe(() => this.save());
		// Verkstadens uppgifter kommer från Axle-kontot och är låsta (de ändras under Inställningar → Företaget
		// i Axle). Kontaktuppgifterna fylls bara i när de är tomma och går att ändra.
		effect(() => {
			const account = this.store.account();
			const user = this.store.user();
			untracked(() => {
				const fromAccount: Record<string, string | undefined> = {
					workshop: account?.workshop,
					orgNo: account?.orgNo,
					addressLine1: account?.addressLine1,
					postalCode: account?.postalCode,
					city: account?.city,
				};
				// Släpp det som var låst från ett konto man loggat ut ur.
				for (const key of this.locked()) {
					const c = this.form.get(key);
					c?.enable({ emitEvent: false });
					if (!account) c?.setValue('', { emitEvent: false });
				}
				const locked = new Set<string>();
				for (const [key, value] of Object.entries(fromAccount)) {
					const c = this.form.get(key);
					if (value?.trim() && c) {
						c.setValue(value.trim(), { emitEvent: false });
						c.disable({ emitEvent: false });
						locked.add(key);
					}
				}
				this.locked.set(locked);
				const contact: Record<string, string | null | undefined> = {
					contactName: user?.name,
					email: user?.email || account?.email,
					phone: user?.phone || account?.phone,
				};
				const patch: Record<string, string> = {};
				for (const [key, value] of Object.entries(contact)) {
					const c = this.form.get(key);
					if (value && c && !String(c.value ?? '').trim()) patch[key] = value;
				}
				if (Object.keys(patch).length) this.form.patchValue(patch);
			});
		});
	}

	invalid(name: keyof typeof this.form.controls): boolean {
		const c = this.form.controls[name];
		return c.invalid && (c.touched || this.submitted());
	}

	async submit(): Promise<void> {
		this.submitted.set(true);
		this.error.set('');
		if (this.sending() || !this.browser) return;
		const lines = this.store.lines();
		if (lines.length === 0) {
			this.error.set('Varukorgen är tom.');
			return;
		}
		if (this.form.invalid) {
			this.error.set('Kontrollera de markerade fälten.');
			return;
		}
		this.sending.set(true);
		const f = this.form.getRawValue();
		try {
			const created = await this.api.createOrder({
				items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
				workshop: f.workshop,
				orgNo: f.orgNo,
				contactName: f.contactName,
				email: f.email,
				phone: f.phone,
				addressLine1: f.addressLine1,
				addressLine2: f.addressLine2 || undefined,
				postalCode: f.postalCode,
				city: f.city,
				note: f.note || undefined,
				acceptedTerms: f.acceptedTerms,
				website: f.website,
			});
			if (!created.checkoutUrl) {
				this.sending.set(false);
				return;
			}
			this.go(created.checkoutUrl);
		} catch (e) {
			this.sending.set(false);
			const body = (e as HttpErrorResponse).error as { error?: { code?: string; message?: string } } | undefined;
			this.error.set(
				body?.error?.code === 'INVALID_SHOP_ORDER' && body.error.message
					? body.error.message
					: 'Det gick inte att starta betalningen. Försök igen om en stund eller mejla support@catso.io.',
			);
		}
	}

	/** Lämnar sidan för Stripes betalsida. Egen metod så att ett test kan fånga den. */
	protected go(url: string): void {
		window.location.assign(url);
	}

	private save(): void {
		if (!this.browser) return;
		try {
			const { website: _w, acceptedTerms: _t, ...fields } = this.form.getRawValue();
			localStorage.setItem(FORM_KEY, JSON.stringify(fields));
		} catch {
			// Utan lagring skriver kunden om uppgifterna efter en omladdning.
		}
	}

	private restore(): void {
		if (!this.browser) return;
		try {
			const raw = localStorage.getItem(FORM_KEY);
			if (raw) this.form.patchValue(JSON.parse(raw) as Record<string, string>, { emitEvent: false });
		} catch {
			// En trasig sparad uppgift ignoreras.
		}
	}
}

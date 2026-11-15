import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	PLATFORM_ID,
	computed,
	inject,
	signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShopApi, type ShopProduct } from './axle-butik.api';
import { cartTotals, kr, orgNoDigits } from './axle-butik.logic';
import { ButikFrameComponent } from './butik-frame.component';

/** Varukorgen och uppgifterna sparas här, så de finns kvar om kunden avbryter betalningen. */
const SAVED_KEY = 'catso.axle.butik.v1';

const CATEGORY_LABEL: Record<ShopProduct['category'], string> = {
	printer: 'Skrivare',
	supplies: 'Förbrukning',
	scanner: 'Skanner',
	terminal: 'Betalterminal',
	other: 'Övrigt',
};

const orgNoValidator = (c: AbstractControl): ValidationErrors | null =>
	orgNoDigits(String(c.value ?? '')) ? null : { orgNo: true };

/**
 * Butiken för verkstäder: hårdvara som Catso köper in och skickar. Kunden väljer varor, skriver
 * verkstadens uppgifter och betalar med kort hos Stripe. Priserna hämtas från servern och visas
 * här exklusive moms; kassan räknar på momsen. Det som dras på kortet räknar servern om och
 * bestämmer, aldrig den här sidan.
 */
@Component({
	selector: 'app-axle-butik',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ReactiveFormsModule, ButikFrameComponent],
	templateUrl: './axle-butik.component.html',
	styleUrl: './axle-butik.component.scss',
})
export class AxleButikComponent {
	private readonly api = inject(ShopApi);
	private readonly fb = inject(FormBuilder);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	readonly canceled = !!inject(ActivatedRoute).snapshot.queryParamMap.get('avbruten');

	readonly kr = kr;
	readonly label = CATEGORY_LABEL;

	readonly products = signal<ShopProduct[]>([]);
	readonly loading = signal(true);
	readonly loadFailed = signal(false);
	/** Antal per vara. */
	readonly qty = signal<Record<string, number>>({});

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
	readonly submitted = signal(false);
	readonly sending = signal(false);
	readonly error = signal('');

	readonly lines = computed(() =>
		this.products()
			.map((p) => ({ product: p, quantity: this.qty()[p.id] ?? 0 }))
			.filter((l) => l.quantity > 0),
	);
	readonly totals = computed(() =>
		cartTotals(
			this.lines().map((l) => ({
				priceMinor: l.product.priceMinor,
				shippingMinor: l.product.shippingMinor,
				vatRate: l.product.vatRate,
				quantity: l.quantity,
			})),
		),
	);
	readonly count = computed(() => this.lines().reduce((n, l) => n + l.quantity, 0));

	constructor() {
		this.restore();
		void this.load();
		this.form.valueChanges.subscribe(() => this.save());
	}

	private async load(): Promise<void> {
		if (!this.browser) {
			this.loading.set(false);
			return;
		}
		try {
			const products = await this.api.products();
			this.products.set(products);
			// En vara som tagits bort ur butiken ska inte ligga kvar i den sparade korgen.
			const known = new Set(products.map((p) => p.id));
			this.qty.update((q) =>
				Object.fromEntries(Object.entries(q).filter(([id, n]) => known.has(id) && n > 0)),
			);
		} catch {
			this.loadFailed.set(true);
		} finally {
			this.loading.set(false);
		}
	}

	/** Hur många av varan som ligger i korgen. */
	have(p: ShopProduct): number {
		return this.qty()[p.id] ?? 0;
	}

	setQty(p: ShopProduct, quantity: number): void {
		const n = Math.max(0, Math.min(p.maxQuantity, quantity));
		this.qty.update((q) => ({ ...q, [p.id]: n }));
		this.save();
	}

	invalid(name: keyof typeof this.form.controls): boolean {
		const c = this.form.controls[name];
		return c.invalid && (c.touched || this.submitted());
	}

	async submit(): Promise<void> {
		this.submitted.set(true);
		this.error.set('');
		if (this.sending() || !this.browser) return;
		if (this.lines().length === 0) {
			this.error.set('Välj minst en vara.');
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
				items: this.lines().map((l) => ({ productId: l.product.id, quantity: l.quantity })),
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
			// Stripes sida tar över. Varukorgen ligger kvar sparad om kunden backar därifrån.
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
			localStorage.setItem(SAVED_KEY, JSON.stringify({ qty: this.qty(), fields }));
		} catch {
			// Utan lagring börjar kunden om efter en omladdning, mer är det inte.
		}
	}

	private restore(): void {
		if (!this.browser) return;
		try {
			const raw = localStorage.getItem(SAVED_KEY);
			if (!raw) return;
			const saved = JSON.parse(raw) as { qty?: Record<string, number>; fields?: Record<string, string> };
			if (saved.qty && typeof saved.qty === 'object') this.qty.set(saved.qty);
			if (saved.fields) this.form.patchValue(saved.fields, { emitEvent: false });
		} catch {
			// En trasig sparad korg ignoreras.
		}
	}
}

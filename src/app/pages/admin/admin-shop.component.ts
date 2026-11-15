import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	AdminService,
	type AdminShopOrder,
	type AdminShopProduct,
	type AdminShopProductInput,
	type AdminShopStatus,
} from './admin.service';
import { kr } from '../axle-butik/axle-butik.logic';

type Tab = 'orders' | 'products';
type OrderFilter = 'todo' | 'ordered' | 'shipped' | 'delivered' | 'all';

const STATUS_LABEL: Record<AdminShopStatus, string> = {
	awaiting_payment: 'Väntar på betalning',
	paid: 'Att köpa in',
	ordered: 'Inköpt',
	shipped: 'Skickad',
	delivered: 'Levererad',
	canceled: 'Avbruten',
	expired: 'Gick ut',
};
const STATUS_CLASS: Record<AdminShopStatus, string> = {
	awaiting_payment: 'bg-neutral-500/20 text-neutral-300',
	paid: 'bg-amber-500/15 text-amber-300',
	ordered: 'bg-sky-500/15 text-sky-300',
	shipped: 'bg-indigo-500/15 text-indigo-300',
	delivered: 'bg-emerald-500/15 text-emerald-300',
	canceled: 'bg-red-500/15 text-red-300',
	expired: 'bg-neutral-500/20 text-neutral-400',
};
const CATEGORIES: { value: AdminShopProduct['category']; label: string }[] = [
	{ value: 'printer', label: 'Skrivare' },
	{ value: 'supplies', label: 'Förbrukning' },
	{ value: 'scanner', label: 'Skanner' },
	{ value: 'terminal', label: 'Betalterminal' },
	{ value: 'other', label: 'Övrigt' },
];

export interface PriceCheck {
	/** Vad kunden betalar per styck inkl. moms, i öre. */
	grossMinor: number;
	/** Vinst per styck exkl. moms (pris minus vårt inköpspris), i öre; null när inköpspriset saknas. */
	marginMinor: number | null;
	/** Vinsten i procent av priset exkl. moms. */
	marginPercent: number | null;
}

/**
 * Räknar på priset medan operatören skriver det. Vinsten är bara varan: frakten, Stripes avgift
 * och vad leverantören tar för frakt till oss ingår inte.
 */
export function priceCheck(price: string, cost: string, vatRate: number): PriceCheck | null {
	const p = toMinor(price);
	if (p == null || p === 0) return null;
	const c = cost.trim() === '' ? null : toMinor(cost);
	return {
		grossMinor: Math.round((p * (100 + vatRate)) / 100),
		marginMinor: c == null ? null : p - c,
		marginPercent: c == null ? null : Math.round(((p - c) / p) * 100),
	};
}

/** Kronor som skrivs ("5 495", "5495,50") till hela öre, eller null när det inte är ett belopp. */
export function toMinor(text: string): number | null {
	const n = Number(text.replace(/\s/g, '').replace(',', '.'));
	return text.trim() !== '' && Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
}

const fromMinor = (minor: number | null): string =>
	minor == null ? '' : String(minor / 100).replace('.', ',');

interface ProductForm {
	id: string | null;
	name: string;
	description: string;
	category: AdminShopProduct['category'];
	image: string;
	price: string;
	shipping: string;
	vatRate: number;
	maxQuantity: number;
	active: boolean;
	sort: number;
	supplier: string;
	cost: string;
}

const emptyForm = (): ProductForm => ({
	id: null,
	name: '',
	description: '',
	category: 'printer',
	image: '',
	price: '',
	shipping: '0',
	vatRate: 25,
	maxQuantity: 10,
	active: false,
	sort: 0,
	supplier: '',
	cost: '',
});

/**
 * Butiken i Catso Admin: ordrar att köpa in, skicka och följa, och varorna med pris och inköpspris.
 * Alla belopp är exklusive moms. Vi köper in efter att betalningen kommit, så en order står som
 * "Att köpa in" tills operatören markerat den köpt.
 */
@Component({
	selector: 'app-admin-shop',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule],
	template: `
		<main class="mx-auto max-w-7xl space-y-5 px-4 py-6">
			<div class="flex flex-wrap items-center gap-2">
				<nav class="flex gap-1 text-sm">
					<button type="button" (click)="tab.set('orders')" class="rounded-lg px-3 py-1.5"
						[class]="tab() === 'orders' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5'">
						Beställningar @if (todoCount() > 0) { <span class="ml-1 rounded-full bg-amber-500/20 px-2 text-amber-300">{{ todoCount() }}</span> }
					</button>
					<button type="button" (click)="tab.set('products')" class="rounded-lg px-3 py-1.5"
						[class]="tab() === 'products' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5'">
						Varor
					</button>
				</nav>
				<span class="flex-1"></span>
				<button type="button" (click)="reload()" class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5">
					{{ loading() ? 'Hämtar…' : 'Uppdatera' }}
				</button>
			</div>

			@if (error()) {
				<p class="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{{ error() }}</p>
			}

			@if (tab() === 'orders') {
				<div class="flex flex-wrap gap-1 text-sm">
					@for (f of filters; track f.id) {
						<button type="button" (click)="filter.set(f.id)" class="rounded-full border border-white/10 px-3 py-1"
							[class]="filter() === f.id ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5'">{{ f.label }}</button>
					}
				</div>

				<section class="overflow-x-auto rounded-xl border border-white/10">
					<table class="w-full text-left text-sm">
						<thead class="bg-white/5 text-xs tracking-wide text-neutral-400 uppercase">
							<tr><th class="px-3 py-2">Order</th><th class="px-3 py-2">Verkstad</th><th class="px-3 py-2">Varor</th><th class="px-3 py-2 text-right">Betalt</th><th class="px-3 py-2 text-right">Vinst</th><th class="px-3 py-2">Status</th></tr>
						</thead>
						<tbody>
							@for (o of visibleOrders(); track o.id) {
								<tr class="cursor-pointer border-t border-white/5 hover:bg-white/5" (click)="open.set(open() === o.id ? null : o.id)">
									<td class="px-3 py-2 whitespace-nowrap">{{ o.number }}<div class="text-xs text-neutral-500">{{ o.createdAt | date: 'yyyy-MM-dd HH:mm' }}</div></td>
									<td class="px-3 py-2">{{ o.buyer.workshop }}<div class="text-xs text-neutral-500">{{ o.buyer.contactName }}</div></td>
									<td class="px-3 py-2">{{ summary(o) }}</td>
									<td class="px-3 py-2 text-right tabular-nums">{{ money(o.totals.totalMinor) }}</td>
									<td class="px-3 py-2 text-right tabular-nums">{{ o.marginMinor == null ? '–' : money(o.marginMinor) }}</td>
									<td class="px-3 py-2"><span class="rounded-full px-2 py-0.5 text-xs" [class]="statusClass[o.status]">{{ statusLabel[o.status] }}</span></td>
								</tr>
								@if (open() === o.id) {
									<tr class="border-t border-white/5 bg-white/[0.03]">
										<td colspan="6" class="space-y-4 px-4 py-4">
											<div class="grid gap-4 md:grid-cols-3">
												<div>
													<div class="text-xs tracking-wide text-neutral-400 uppercase">Köpare</div>
													<div>{{ o.buyer.workshop }}, org.nr {{ o.buyer.orgNo }}</div>
													<div>{{ o.buyer.contactName }}</div>
													<div><a class="underline" [href]="'mailto:' + o.buyer.email">{{ o.buyer.email }}</a></div>
													<div>{{ o.buyer.phone }}</div>
												</div>
												<div>
													<div class="text-xs tracking-wide text-neutral-400 uppercase">Leverans</div>
													<div>{{ o.address.line1 }}</div>
													@if (o.address.line2) { <div>{{ o.address.line2 }}</div> }
													<div>{{ o.address.postalCode }} {{ o.address.city }}</div>
													@if (o.note) { <div class="mt-2 text-neutral-300">"{{ o.note }}"</div> }
												</div>
												<div>
													<div class="text-xs tracking-wide text-neutral-400 uppercase">Rader</div>
													@for (l of o.lines; track l.productId) {
														<div>{{ l.quantity }} × {{ l.name }} <span class="text-neutral-500">inköp {{ l.costMinor == null ? '?' : money(l.costMinor) }}</span></div>
													}
													<div class="mt-1 text-neutral-400">Netto {{ money(o.totals.netMinor) }} · moms {{ money(o.totals.vatMinor) }}</div>
												</div>
											</div>

											<div class="grid gap-3 md:grid-cols-3">
												<label class="block text-sm"><span class="text-neutral-300">Inköp hos leverantören (referens)</span>
													<input class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="draft(o).supplierRef" (ngModelChange)="draft(o).supplierRef = $event" /></label>
												<label class="block text-sm"><span class="text-neutral-300">Spårningsnummer</span>
													<input class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="draft(o).trackingNo" (ngModelChange)="draft(o).trackingNo = $event" /></label>
												<label class="block text-sm"><span class="text-neutral-300">Intern anteckning</span>
													<input class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="draft(o).internalNote" (ngModelChange)="draft(o).internalNote = $event" /></label>
											</div>

											<div class="flex flex-wrap gap-2 text-sm">
												<button type="button" (click)="saveOrder(o)" class="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5">Spara</button>
												@if (o.status === 'paid') {
													<button type="button" (click)="saveOrder(o, 'ordered')" class="rounded-lg bg-[#d4af37] px-3 py-1.5 font-semibold text-black">Markera köpt hos leverantören</button>
												}
												@if (o.status === 'ordered') {
													<button type="button" (click)="saveOrder(o, 'shipped')" class="rounded-lg bg-[#d4af37] px-3 py-1.5 font-semibold text-black">Markera skickad och mejla kunden</button>
												}
												@if (o.status === 'shipped') {
													<button type="button" (click)="saveOrder(o, 'delivered')" class="rounded-lg bg-[#d4af37] px-3 py-1.5 font-semibold text-black">Markera levererad</button>
												}
												@if (o.status === 'paid' || o.status === 'ordered') {
													<button type="button" (click)="cancel(o)" class="rounded-lg border border-red-500/40 px-3 py-1.5 text-red-300 hover:bg-red-500/10">Avbryt och betala tillbaka</button>
												}
											</div>
										</td>
									</tr>
								}
							} @empty {
								<tr><td colspan="6" class="px-3 py-8 text-center text-neutral-500">{{ loading() ? 'Hämtar…' : 'Inga beställningar här.' }}</td></tr>
							}
						</tbody>
					</table>
				</section>
			} @else {
				<section class="grid gap-5 lg:grid-cols-12">
					<div class="space-y-2 lg:col-span-7">
						@for (p of products(); track p.id) {
							<button type="button" (click)="edit(p)" class="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10">
								<span>
									<span class="font-medium">{{ p.name }}</span>
									<span class="ml-2 rounded-full px-2 py-0.5 text-xs" [class]="p.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-neutral-500/20 text-neutral-400'">{{ p.active ? 'Säljs' : 'Dold' }}</span>
									<span class="block text-xs text-neutral-500">{{ p.supplier || 'ingen leverantör' }}</span>
								</span>
								<span class="text-right tabular-nums">
									{{ money(p.priceMinor) }}
									<span class="block text-xs text-neutral-500">inköp {{ p.costMinor == null ? '?' : money(p.costMinor) }}</span>
								</span>
							</button>
						} @empty {
							<p class="py-8 text-center text-neutral-500">Inga varor än. Lägg till den första till höger.</p>
						}
					</div>

					<form class="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:col-span-5" (ngSubmit)="saveProduct()">
						<h2 class="font-semibold">{{ form().id ? 'Ändra vara' : 'Ny vara' }}</h2>
						<label class="block text-sm"><span class="text-neutral-300">Namn</span>
							<input name="name" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().name" (ngModelChange)="patch({ name: $event })" required /></label>
						<label class="block text-sm"><span class="text-neutral-300">Beskrivning</span>
							<textarea name="description" rows="3" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().description" (ngModelChange)="patch({ description: $event })"></textarea></label>
						<div class="grid grid-cols-2 gap-3">
							<label class="block text-sm"><span class="text-neutral-300">Kategori</span>
								<select name="category" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().category" (ngModelChange)="patch({ category: $event })">
									@for (c of categories; track c.value) { <option [value]="c.value">{{ c.label }}</option> }
								</select></label>
							<label class="block text-sm"><span class="text-neutral-300">Moms</span>
								<select name="vat" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().vatRate" (ngModelChange)="patch({ vatRate: +$event })">
									@for (v of [25, 12, 6, 0]; track v) { <option [value]="v">{{ v }} %</option> }
								</select></label>
						</div>
						<label class="block text-sm"><span class="text-neutral-300">Bild (https-adress)</span>
							<input name="image" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().image" (ngModelChange)="patch({ image: $event })" placeholder="https://…" /></label>
						<div class="grid grid-cols-3 gap-3">
							<label class="block text-sm"><span class="text-neutral-300">Pris, kr exkl. moms</span>
								<input name="price" inputmode="decimal" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().price" (ngModelChange)="patch({ price: $event })" required /></label>
							<label class="block text-sm"><span class="text-neutral-300">Frakt per st, kr</span>
								<input name="shipping" inputmode="decimal" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().shipping" (ngModelChange)="patch({ shipping: $event })" /></label>
							<label class="block text-sm"><span class="text-neutral-300">Vårt inköpspris, kr</span>
								<input name="cost" inputmode="decimal" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().cost" (ngModelChange)="patch({ cost: $event })" /></label>
						</div>
						@if (check(); as c) {
							<p class="rounded-lg bg-black/30 px-3 py-2 text-sm" [class]="c.marginMinor != null && c.marginMinor <= 0 ? 'text-red-300' : 'text-neutral-300'">
								Kunden betalar {{ money(c.grossMinor) }} inkl. moms per st.
								@if (c.marginMinor == null) {
									Fyll i vårt inköpspris för att se vinsten.
								} @else if (c.marginMinor <= 0) {
									Priset ligger under inköpspriset: ni går back {{ money(-c.marginMinor) }} per st.
								} @else {
									Vinst {{ money(c.marginMinor) }} per st ({{ c.marginPercent }} % av priset), före frakt och Stripes avgift.
								}
							</p>
						}
						<div class="grid grid-cols-3 gap-3">
							<label class="block text-sm"><span class="text-neutral-300">Leverantör</span>
								<input name="supplier" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().supplier" (ngModelChange)="patch({ supplier: $event })" /></label>
							<label class="block text-sm"><span class="text-neutral-300">Högst antal</span>
								<input name="max" type="number" min="1" max="99" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().maxQuantity" (ngModelChange)="patch({ maxQuantity: +$event })" /></label>
							<label class="block text-sm"><span class="text-neutral-300">Ordning</span>
								<input name="sort" type="number" min="0" class="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" [ngModel]="form().sort" (ngModelChange)="patch({ sort: +$event })" /></label>
						</div>
						<label class="flex items-center gap-2 text-sm">
							<input name="active" type="checkbox" [ngModel]="form().active" (ngModelChange)="patch({ active: $event })" />
							<span>Visa i butiken</span>
						</label>
						<div class="flex flex-wrap gap-2 text-sm">
							<button type="submit" class="rounded-lg bg-[#d4af37] px-3 py-1.5 font-semibold text-black">{{ form().id ? 'Spara' : 'Lägg till' }}</button>
							@if (form().id) {
								<button type="button" (click)="form.set(emptyForm())" class="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5">Ny vara</button>
								<button type="button" (click)="remove()" class="rounded-lg border border-red-500/40 px-3 py-1.5 text-red-300 hover:bg-red-500/10">Ta bort</button>
							}
						</div>
						<p class="text-xs text-neutral-500">Priser och frakt är exklusive moms. Inköpspriset ser bara ni, och används för vinsten på ordern.</p>
					</form>
				</section>
			}
		</main>
	`,
})
export class AdminShopComponent implements OnInit {
	private readonly api = inject(AdminService);

	readonly statusLabel = STATUS_LABEL;
	readonly statusClass = STATUS_CLASS;
	readonly categories = CATEGORIES;
	readonly emptyForm = emptyForm;
	readonly filters: { id: OrderFilter; label: string }[] = [
		{ id: 'todo', label: 'Att köpa in' },
		{ id: 'ordered', label: 'Inköpta' },
		{ id: 'shipped', label: 'Skickade' },
		{ id: 'delivered', label: 'Levererade' },
		{ id: 'all', label: 'Alla' },
	];

	readonly tab = signal<Tab>('orders');
	readonly filter = signal<OrderFilter>('todo');
	readonly loading = signal(false);
	readonly error = signal('');
	readonly orders = signal<AdminShopOrder[]>([]);
	readonly products = signal<AdminShopProduct[]>([]);
	readonly open = signal<string | null>(null);
	readonly form = signal<ProductForm>(emptyForm());

	/** Det som skrivits i en orders fält men inte sparats än, per order. */
	private readonly drafts = new Map<string, { supplierRef: string; trackingNo: string; internalNote: string }>();

	readonly check = computed(() => priceCheck(this.form().price, this.form().cost, this.form().vatRate));

	readonly todoCount = computed(() => this.orders().filter((o) => o.status === 'paid').length);
	readonly visibleOrders = computed(() => {
		const f = this.filter();
		return this.orders().filter((o) =>
			f === 'all' ? true : f === 'todo' ? o.status === 'paid' : o.status === f,
		);
	});

	ngOnInit(): void {
		void this.reload();
	}

	readonly money = kr;

	summary(o: AdminShopOrder): string {
		return o.lines.map((l) => `${l.quantity} × ${l.name}`).join(', ');
	}

	draft(o: AdminShopOrder) {
		let d = this.drafts.get(o.id);
		if (!d) {
			d = { supplierRef: o.supplierRef, trackingNo: o.trackingNo, internalNote: o.internalNote };
			this.drafts.set(o.id, d);
		}
		return d;
	}

	async reload(): Promise<void> {
		this.loading.set(true);
		this.error.set('');
		try {
			const [orders, products] = await Promise.all([this.api.shopOrders(), this.api.shopProducts()]);
			this.orders.set(orders);
			this.products.set(products);
			this.drafts.clear();
		} catch (e) {
			this.error.set(this.message(e, 'Kunde inte hämta butiken.'));
		} finally {
			this.loading.set(false);
		}
	}

	async saveOrder(o: AdminShopOrder, status?: 'ordered' | 'shipped' | 'delivered'): Promise<void> {
		this.error.set('');
		const d = this.draft(o);
		try {
			const updated = await this.api.updateShopOrder(o.id, { ...d, ...(status ? { status } : {}) });
			this.orders.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
			this.drafts.delete(o.id);
		} catch (e) {
			this.error.set(this.message(e, 'Kunde inte spara ordern.'));
		}
	}

	async cancel(o: AdminShopOrder): Promise<void> {
		const ok = confirm(
			`Avbryta ${o.number} och betala tillbaka ${this.money(o.totals.totalMinor)} till kundens kort? Kunden får ett mejl.`,
		);
		if (!ok) return;
		this.error.set('');
		try {
			const updated = await this.api.cancelShopOrder(o.id, true);
			this.orders.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
		} catch (e) {
			this.error.set(this.message(e, 'Kunde inte avbryta ordern.'));
		}
	}

	edit(p: AdminShopProduct): void {
		this.form.set({
			id: p.id,
			name: p.name,
			description: p.description,
			category: p.category,
			image: p.image ?? '',
			price: fromMinor(p.priceMinor),
			shipping: fromMinor(p.shippingMinor),
			vatRate: p.vatRate,
			maxQuantity: p.maxQuantity,
			active: p.active,
			sort: p.sort,
			supplier: p.supplier,
			cost: fromMinor(p.costMinor),
		});
	}

	patch(change: Partial<ProductForm>): void {
		this.form.update((f) => ({ ...f, ...change }));
	}

	async saveProduct(): Promise<void> {
		const f = this.form();
		const price = toMinor(f.price);
		const shipping = toMinor(f.shipping || '0');
		const cost = f.cost.trim() === '' ? null : toMinor(f.cost);
		if (!f.name.trim() || price == null || price < 100 || shipping == null || (f.cost.trim() !== '' && cost == null)) {
			this.error.set('Fyll i namn och ett pris (minst 1 kr). Frakt och inköpspris ska vara belopp i kronor.');
			return;
		}
		const body: AdminShopProductInput = {
			name: f.name.trim(),
			description: f.description.trim(),
			category: f.category,
			image: f.image.trim() || null,
			priceMinor: price,
			shippingMinor: shipping,
			vatRate: f.vatRate,
			maxQuantity: f.maxQuantity,
			active: f.active,
			sort: f.sort,
			supplier: f.supplier.trim(),
			costMinor: cost,
		};
		this.error.set('');
		try {
			const saved = await this.api.saveShopProduct(f.id, body);
			this.products.update((list) =>
				f.id ? list.map((p) => (p.id === saved.id ? saved : p)) : [...list, saved],
			);
			this.products.update((list) => [...list].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, 'sv')));
			this.form.set(emptyForm());
		} catch (e) {
			this.error.set(this.message(e, 'Kunde inte spara varan.'));
		}
	}

	async remove(): Promise<void> {
		const id = this.form().id;
		if (!id || !confirm('Ta bort varan? Gamla ordrar behåller sin egen kopia.')) return;
		this.error.set('');
		try {
			await this.api.deleteShopProduct(id);
			this.products.update((list) => list.filter((p) => p.id !== id));
			this.form.set(emptyForm());
		} catch (e) {
			this.error.set(this.message(e, 'Kunde inte ta bort varan.'));
		}
	}

	private message(e: unknown, fallback: string): string {
		const body = (e as HttpErrorResponse).error as { error?: { message?: string } } | undefined;
		return body?.error?.message ?? fallback;
	}
}

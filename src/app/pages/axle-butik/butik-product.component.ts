import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { kr } from './axle-butik.logic';
import { CATEGORY_LABEL } from './axle-butik.component';
import { ButikFrameComponent } from './butik-frame.component';
import { ButikVisualComponent } from './butik-visual.component';
import { ButikStore } from './butik.store';

/** En varas egen sida: stor bild, pris, antal och beskrivning. */
@Component({
	selector: 'app-butik-product',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ButikFrameComponent, ButikVisualComponent],
	styleUrl: './axle-butik.component.scss',
	template: `
		<app-butik-frame>
			<div class="bay min-h-screen bg-white text-[#2b3a3a] antialiased">
				<main class="mx-auto max-w-7xl px-4 pt-24 pb-20">
					<a routerLink="/axle/butik" class="text-[#00706a] hover:underline">← Alla varor</a>
					@if (product(); as p) {
						<div class="mt-6 grid gap-10 lg:grid-cols-2">
							<div class="card relative aspect-square overflow-hidden">
								<app-butik-visual [image]="p.image" [category]="p.category" [name]="p.name" />
								<span class="absolute top-4 left-4"><span class="badge-fit"><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" clip-rule="evenodd"/></svg>Kompatibel med Axle direkt</span></span>
							</div>
							<div>
								<div class="text-sm font-semibold tracking-wide text-[#00706a] uppercase">{{ label[p.category] }}</div>
								<h1 class="mt-2 text-3xl leading-tight font-extrabold text-[#0d1b1b] sm:text-4xl">{{ p.name }}</h1>
								@if (p.compareAtMinor) {
									<div class="mt-6 flex items-center gap-3">
										<span class="text-xl text-[#6b7f7f] line-through tabular-nums">{{ kr(p.compareAtMinor) }}</span>
										<span class="save">Spara {{ kr(p.compareAtMinor - p.priceMinor) }}</span>
									</div>
								}
								<div class="text-4xl font-extrabold text-[#0d1b1b] tabular-nums" [class.mt-6]="!p.compareAtMinor">{{ kr(p.priceMinor) }}</div>
								<div class="mt-1 text-[#6b7f7f]">
									exkl. moms · {{ kr(p.priceInclVatMinor) }} inkl. moms ·
									@if (p.shippingMinor > 0) { frakt {{ kr(p.shippingMinor) }} per st } @else { fri frakt }
								</div>

								<div class="mt-8 flex flex-wrap items-center gap-4">
									<div class="stepper" role="group" aria-label="Antal">
										<button type="button" (click)="qty.set(max(1, qty() - 1))" [disabled]="qty() <= 1" aria-label="Färre">−</button>
										<span>{{ qty() }}</span>
										<button type="button" (click)="qty.set(min(p.maxQuantity, qty() + 1))" [disabled]="qty() >= p.maxQuantity" aria-label="Fler">+</button>
									</div>
									<button type="button" class="btn btn-primary" (click)="add(p)">Lägg i varukorg</button>
								</div>
								@if (added()) {
									<p class="mt-4 text-[#00706a]" role="status">
										Lagd i varukorgen. <a routerLink="/axle/butik/kassa" class="font-semibold underline">Till kassan</a>
									</p>
								}

								@if (p.description) {
									<div class="mt-10 border-t border-[#e3eaea] pt-6">
										<h2 class="group-title">Om varan</h2>
										<p class="mt-3 text-lg leading-relaxed whitespace-pre-line text-[#4a5d5d]">{{ p.description }}</p>
									</div>
								}
							</div>
						</div>
					} @else if (store.loading()) {
						<p class="mt-8 text-[#6b7f7f]">Hämtar…</p>
					} @else {
						<p class="mt-8 text-xl text-[#4a5d5d]">Varan finns inte längre. <a routerLink="/axle/butik" class="underline">Se alla varor</a>.</p>
					}
				</main>
			</div>
		</app-butik-frame>
	`,
})
export class ButikProductComponent {
	readonly store = inject(ButikStore);
	private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
	readonly kr = kr;
	readonly label = CATEGORY_LABEL;
	readonly qty = signal(1);
	readonly added = signal(false);
	readonly product = computed(() => this.store.product(this.id));

	min = Math.min;
	max = Math.max;

	add(p: NonNullable<ReturnType<ButikProductComponent['product']>>): void {
		this.store.add(p, this.qty());
		this.added.set(true);
	}
}

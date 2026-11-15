import { isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	PLATFORM_ID,
	computed,
	inject,
	signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShopApi, type ShopOrderStatus, type ShopOrderView } from './axle-butik.api';
import { kr } from './axle-butik.logic';
import { ButikFrameComponent } from './butik-frame.component';
import { ButikStore } from './butik.store';

/** Så länge väntar sidan på att Stripes besked kommit fram: 20 försök med 3 sekunder emellan. */
const POLL_MS = 3000;
const POLL_TRIES = 20;

const HEADLINE: Record<ShopOrderStatus, string> = {
	awaiting_payment: 'Vi väntar på betalningen',
	paid: 'Tack för beställningen',
	ordered: 'Tack för beställningen',
	shipped: 'Beställningen är skickad',
	delivered: 'Beställningen är levererad',
	canceled: 'Beställningen är avbruten',
	expired: 'Beställningen gick ut',
};

const TEXT: Record<ShopOrderStatus, string> = {
	awaiting_payment: 'Sidan uppdateras av sig själv.',
	paid: 'Vi mejlar när paketet skickats.',
	ordered: 'Vi mejlar när paketet skickats.',
	shipped: 'Paketet är på väg.',
	delivered: '',
	canceled: 'Har ni betalat betalar vi tillbaka beloppet till kortet.',
	expired: 'Betalningen blev aldrig klar och inget har dragits.',
};

/** Kundens sida om sin order. Adressen bär en hemlig nyckel som bara kunden och vi har. */
@Component({
	selector: 'app-axle-butik-tack',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ButikFrameComponent],
	styleUrl: './axle-butik.component.scss',
	template: `
		<app-butik-frame>
			<div class="bay min-h-screen bg-white text-[#2b3a3a] antialiased">
				<main class="hero px-4 pt-28 pb-20 md:pt-36">
					<div class="mx-auto max-w-3xl">
						@if (order(); as o) {
							<p class="text-sm font-semibold tracking-wide text-[#00706a] uppercase">Order {{ o.number }}</p>
							<h1 class="mt-2 text-4xl font-extrabold tracking-tight text-[#0d1b1b]">{{ headline() }}</h1>
							@if (text()) {
								<p class="mt-4 text-xl text-[#4a5d5d]">{{ text() }}</p>
							}

							@if (o.status === 'shipped' && o.trackingNo) {
								<p class="mt-4"><b>Spårningsnummer:</b> {{ o.trackingNo }}</p>
							}

							<div class="card mt-8 p-6">
								<ul class="space-y-1">
									@for (l of o.lines; track l.name) {
										<li class="flex justify-between gap-4">
											<span>{{ l.quantity }} × {{ l.name }}</span>
											<span class="tabular-nums">{{ kr(l.unitMinor * l.quantity) }}</span>
										</li>
									}
								</ul>
								<dl class="mt-3 space-y-1 border-t border-[#e3eaea] pt-3 text-[#4a5d5d]">
									@if (o.totals.shippingMinor > 0) {
										<div class="flex justify-between"><dt>Frakt</dt><dd class="tabular-nums">{{ kr(o.totals.shippingMinor) }}</dd></div>
									}
									<div class="flex justify-between"><dt>Summa exkl. moms</dt><dd class="tabular-nums">{{ kr(o.totals.netMinor) }}</dd></div>
									<div class="flex justify-between"><dt>Moms</dt><dd class="tabular-nums">{{ kr(o.totals.vatMinor) }}</dd></div>
									<div class="flex justify-between text-lg font-extrabold text-[#0d1b1b]"><dt>Totalt</dt><dd class="tabular-nums">{{ kr(o.totals.totalMinor) }}</dd></div>
								</dl>
							</div>
						} @else if (missing()) {
							<h1 class="text-4xl font-extrabold tracking-tight text-[#0d1b1b]">Vi hittar inte ordern</h1>
							<p class="mt-4 text-xl text-[#4a5d5d]">
								Länken stämmer inte. Mejla <a href="mailto:support&#64;catso.io" class="underline">support&#64;catso.io</a> om ni har
								betalat och inte fått något mejl.
							</p>
						} @else {
							<p class="text-[#6b7f7f]">Hämtar ordern…</p>
						}

						<a routerLink="/axle/butik" class="btn btn-primary mt-10">Tillbaka till butiken</a>
					</div>
				</main>
			</div>
		</app-butik-frame>
	`,
})
export class AxleButikTackComponent {
	private readonly api = inject(ShopApi);
	private readonly store = inject(ButikStore);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly token = inject(ActivatedRoute).snapshot.queryParamMap.get('order') ?? '';
	private timer: ReturnType<typeof setTimeout> | undefined;
	private tries = 0;

	readonly kr = kr;
	readonly order = signal<ShopOrderView | null>(null);
	readonly missing = signal(false);
	readonly headline = computed(() => HEADLINE[this.order()?.status ?? 'paid']);
	readonly text = computed(() => TEXT[this.order()?.status ?? 'paid']);

	constructor() {
		inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
		if (!this.token) this.missing.set(true);
		else if (this.browser) void this.poll();
	}

	/** Webhooken från Stripe avgör, inte att kunden kom tillbaka hit: vänta tills ordern syns som betald. */
	private async poll(): Promise<void> {
		try {
			const o = await this.api.order(this.token);
			this.order.set(o);
			// Betald order: varukorgen är köpt och ska inte ligga kvar.
			if (o.status !== 'awaiting_payment' && o.status !== 'canceled' && o.status !== 'expired') this.store.clear();
			if (o.status === 'awaiting_payment' && ++this.tries < POLL_TRIES) {
				this.timer = setTimeout(() => void this.poll(), POLL_MS);
			}
		} catch {
			if (!this.order()) this.missing.set(true);
		}
	}
}

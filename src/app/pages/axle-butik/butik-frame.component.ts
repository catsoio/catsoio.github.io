import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButikLoginComponent } from './butik-login.component';
import { ButikStore } from './butik.store';

/** Rubrikfält, varukorg, inloggning och fotrad runt butikens sidor. */
@Component({
	selector: 'app-butik-frame',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ButikLoginComponent],
	template: `
		<header class="fixed inset-x-0 top-0 z-50 border-b border-[#e3eaea] bg-white/95 backdrop-blur">
			<nav class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3" aria-label="Huvudmeny">
				<a routerLink="/axle/butik" class="flex items-center gap-3">
					<img src="assets/imgs/axle/axle-logo.svg" alt="Axle" class="h-6 w-auto" />
					<span class="text-xl font-bold text-[#0d1b1b]">Catso Axle</span>
					<span class="rounded-md bg-[#e3efee] px-2 py-0.5 text-sm font-bold text-[#00706a]">Butik</span>
				</a>
				<span class="flex-1"></span>
				<a routerLink="/axle" class="hidden text-[#4a5d5d] hover:text-[#00706a] md:inline">Om Axle</a>
				@if (store.user(); as u) {
					<span class="hidden max-w-[14rem] truncate text-sm text-[#4a5d5d] sm:inline">{{ u.name || u.email || u.phone }}</span>
					<button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-[#4a5d5d] hover:bg-[#f6faf9]" (click)="store.logout()">Logga ut</button>
				} @else {
					<button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-[#00706a] hover:bg-[#f6faf9]" (click)="store.loginOpen.set(true)">Logga in</button>
				}
				<a routerLink="/axle/butik/kassa" class="relative flex items-center gap-2 rounded-xl bg-[#00706a] px-4 py-2 font-semibold text-white hover:bg-[#00605a]" aria-label="Varukorg">
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>
					<span class="hidden sm:inline">Varukorg</span>
					@if (store.count() > 0) {
						<span class="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-sm font-bold text-[#00706a]">{{ store.count() }}</span>
					}
				</a>
			</nav>
		</header>
		<ng-content />
		<footer class="border-t border-[#e3eaea] px-4 py-8 text-[#6b7f7f]">
			<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
				<span>© {{ year }} Catso AI &amp; Robotics</span>
				<nav class="flex gap-5">
					<a routerLink="/" class="hover:text-[#00706a]">Catso</a>
					<a routerLink="/integritet" class="hover:text-[#00706a]">Integritet</a>
					<a href="mailto:support&#64;catso.io" class="hover:text-[#00706a]">support&#64;catso.io</a>
				</nav>
			</div>
		</footer>
		<app-butik-login />
	`,
})
export class ButikFrameComponent {
	readonly store = inject(ButikStore);
	readonly year = new Date().getFullYear();
}

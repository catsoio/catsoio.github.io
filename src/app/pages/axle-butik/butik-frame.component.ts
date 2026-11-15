import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Rubrikfält och fotrad runt butikens sidor, samma som prissidan har. */
@Component({
	selector: 'app-butik-frame',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	template: `
		<header class="fixed inset-x-0 top-0 z-50 border-b border-[#e3eaea] bg-white/90 backdrop-blur">
			<nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3" aria-label="Huvudmeny">
				<a routerLink="/apps/axle" class="flex items-center gap-3">
					<img src="assets/imgs/axle/axle-logo.svg" alt="Axle" class="h-6 w-auto" />
					<span class="text-xl font-bold text-[#0d1b1b]">Catso Axle</span>
				</a>
				<div class="flex items-center gap-6 text-base font-medium text-[#4a5d5d]">
					<a routerLink="/axle/priser" class="hidden hover:text-[#00706a] md:inline">Priser</a>
					<a routerLink="/axle/butik" class="text-[#00706a]">Butik</a>
				</div>
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
	`,
})
export class ButikFrameComponent {
	readonly year = new Date().getFullYear();
}

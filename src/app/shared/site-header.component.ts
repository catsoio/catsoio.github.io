import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PRODUCTS } from './site-nav';

/** Ljus sidhuvud för företagssidorna (Produkter, Om oss, Kontakt, Integritet, 404). */
@Component({
	selector: 'app-site-header',
	standalone: true,
	imports: [RouterLink, RouterLinkActive],
	template: `
		<header class="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
			<nav
				class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6"
				aria-label="Huvudmeny"
			>
				<a routerLink="/" class="flex shrink-0 items-center gap-3">
					<img src="/assets/imgs/catso-logo-blackwhite.png" class="h-9 w-9" alt="Catso" />
					<span class="text-base font-semibold tracking-tight text-black">Catso AI &amp; Robotics</span>
				</a>

				<div class="hidden items-center gap-6 text-sm text-black/65 lg:flex">
					<a routerLink="/produkter" routerLinkActive="text-black" class="hover:text-black">Produkter</a>
					@for (p of products.slice(0, 3); track p.path) {
						<a [routerLink]="p.path" class="hover:text-black">{{ p.name }}</a>
					}
					<a routerLink="/om-oss" routerLinkActive="text-black" class="hover:text-black">Om oss</a>
				</div>

				<div class="flex items-center gap-2">
					<a
						routerLink="/kontakt"
						class="inline-flex h-10 items-center rounded-2xl bg-black px-5 text-sm font-medium text-white hover:bg-black/85"
						>Kontakta oss</a
					>
					<button
						type="button"
						class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/15 lg:hidden"
						[attr.aria-expanded]="open()"
						aria-label="Meny"
						(click)="open.set(!open())"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</nav>
			@if (open()) {
				<div class="space-y-1 border-t border-black/10 bg-white px-4 py-3 lg:hidden">
					<a routerLink="/produkter" class="block rounded-xl px-3 py-2.5 text-sm font-medium">Produkter</a>
					@for (p of products; track p.path) {
						<a [routerLink]="p.path" class="block rounded-xl px-3 py-2 pl-6 text-sm text-black/65">{{ p.name }}</a>
					}
					<a routerLink="/om-oss" class="block rounded-xl px-3 py-2.5 text-sm font-medium">Om oss</a>
					<a routerLink="/kontakt" class="block rounded-xl px-3 py-2.5 text-sm font-medium">Kontakt</a>
				</div>
			}
		</header>
	`,
})
export class SiteHeaderComponent {
	readonly products = PRODUCTS;
	readonly open = signal(false);
}

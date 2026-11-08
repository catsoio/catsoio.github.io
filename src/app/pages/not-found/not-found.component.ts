import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer.component';
import { SiteHeaderComponent } from '../../shared/site-header.component';
import { PRODUCTS } from '../../shared/site-nav';

/** Visas för adresser som inte finns. GitHub Pages svarar 404 och serverar den här sidan som 404.html. */
@Component({
	selector: 'app-not-found',
	standalone: true,
	imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
	template: `
		<div class="bg-white text-black">
			<app-site-header />
			<main class="mx-auto max-w-3xl px-4 py-20 md:py-28">
				<p class="text-sm font-medium text-black/45">404</p>
				<h1 class="mt-2 text-4xl font-semibold tracking-tight">Sidan finns inte</h1>
				<p class="mt-4 text-lg text-black/65">
					Adressen stämmer inte, eller så har sidan flyttat. Här är det vi har:
				</p>
				<ul class="mt-6 space-y-2">
					<li><a routerLink="/" class="font-medium underline">Startsidan</a></li>
					@for (p of products; track p.path) {
						<li>
							<a [routerLink]="p.path" class="font-medium underline">{{ p.name }}</a>
							<span class="text-black/55"> – {{ p.audience }}</span>
						</li>
					}
					<li><a routerLink="/kontakt" class="font-medium underline">Kontakt</a></li>
				</ul>
			</main>
			<app-site-footer />
		</div>
	`,
})
export class NotFoundComponent {
	readonly products = PRODUCTS;
}

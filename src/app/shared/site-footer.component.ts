import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY_LINKS, PRODUCTS } from './site-nav';

/** Mörk sidfot med alla riktiga sidor länkade, så sökmotorer och besökare ser hela strukturen. */
@Component({
	selector: 'app-site-footer',
	standalone: true,
	imports: [RouterLink],
	template: `
		<footer class="bg-neutral-950 text-neutral-400">
			<div class="mx-auto max-w-6xl px-4 py-12 md:px-6">
				<div class="grid gap-10 md:grid-cols-4">
					<div class="md:col-span-2">
						<a routerLink="/" class="flex items-center gap-3">
							<img src="/assets/imgs/catso-logo-blackwhite.png" class="h-8 w-8 invert" alt="" />
							<span class="text-base font-semibold text-white">Catso AI &amp; Robotics</span>
						</a>
						<p class="mt-4 max-w-sm text-sm">
							Verkstadssystem, AI-agenter, Shopify-appar och robotik. Byggt i Sverige, med datahantering inom
							EU.
						</p>
					</div>
					<nav aria-label="Produkter">
						<h2 class="text-sm font-semibold text-white">Produkter</h2>
						<ul class="mt-3 space-y-2 text-sm">
							@for (p of products; track p.path) {
								<li>
									<a [routerLink]="p.path" class="hover:text-white">{{ p.name }}</a>
								</li>
							}
						</ul>
					</nav>
					<nav aria-label="Företaget">
						<h2 class="text-sm font-semibold text-white">Företaget</h2>
						<ul class="mt-3 space-y-2 text-sm">
							@for (l of company; track l.path) {
								<li>
									<a [routerLink]="l.path" class="hover:text-white">{{ l.label }}</a>
								</li>
							}
							<li>
								<a href="mailto:support@catso.io" class="hover:text-white">support&#64;catso.io</a>
							</li>
						</ul>
					</nav>
				</div>
				<p class="mt-10 border-t border-white/10 pt-6 text-sm text-neutral-500">
					© {{ year }} Catso AI &amp; Robotics. Alla rättigheter förbehållna.
				</p>
			</div>
		</footer>
	`,
})
export class SiteFooterComponent {
	readonly products = PRODUCTS;
	readonly company = COMPANY_LINKS;
	readonly year = new Date().getFullYear();
}

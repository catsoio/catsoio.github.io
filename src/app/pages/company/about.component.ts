import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer.component';
import { SiteHeaderComponent } from '../../shared/site-header.component';
import { PRODUCTS } from '../../shared/site-nav';

@Component({
	selector: 'app-about',
	standalone: true,
	imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
	template: `
		<div class="bg-white text-black">
			<app-site-header />
			<main class="mx-auto max-w-3xl px-4 py-14 md:py-20">
				<nav aria-label="Brödsmulor" class="mb-6 text-sm text-black/50">
					<a routerLink="/" class="hover:text-black">Catso</a> <span aria-hidden="true" class="mx-1">/</span> Om oss
				</nav>
				<h1 class="text-4xl font-semibold tracking-tight md:text-5xl">Om Catso AI &amp; Robotics</h1>
				<p class="mt-5 text-lg text-black/65">
					Catso AI &amp; Robotics bygger programvara för svensk verksamhet: verkstadssystem för däck- och
					bilverkstäder, AI-agenter för advokatbyråer och offentlig sektor, appar för Shopify och styrning av
					robotflottor för industrin.
				</p>

				<h2 class="mt-12 text-2xl font-semibold">Vad vi gör</h2>
				<p class="mt-3 text-black/65">
					Vi bygger egna produkter och driftar dem själva, så att den som ringer supporten pratar med dem som
					skrivit koden. Våra system används i verkligheten av verkstäder som har hjul i hyllan och bilar på
					lyftet, inte i ett demoläge.
				</p>
				<ul class="mt-4 space-y-2 text-black/65">
					@for (p of products.slice(0, 3); track p.path) {
						<li>
							<a [routerLink]="p.path" class="font-medium text-black underline">{{ p.name }}</a>
							<span> för {{ p.audience.toLowerCase() }}.</span>
						</li>
					}
				</ul>
				<p class="mt-3 text-black/65">
					Se alla på <a routerLink="/produkter" class="font-medium text-black underline">produktsidan</a>.
				</p>

				<h2 class="mt-12 text-2xl font-semibold">Så arbetar vi</h2>
				<ul class="mt-3 list-disc space-y-2 pl-5 text-black/65">
					<li>Byggt i Sverige, med datahantering inom EU.</li>
					<li>AI-agenter som körs lokalt eller i svensk molnregion, så att er data inte lämnar er miljö.</li>
					<li>Vi är officiell Shopify-partner.</li>
					<li>Robotprojekt börjar i simulering med en digital tvilling, och först sedan körs robotarna på riktigt.</li>
				</ul>

				<h2 class="mt-12 text-2xl font-semibold">Hör av dig</h2>
				<p class="mt-3 text-black/65">
					Vill du veta vad det blir för er verksamhet, eller har du ett problem som en AI-agent eller en robot
					kan lösa? Mejla
					<a href="mailto:support@catso.io" class="font-medium text-black underline">support&#64;catso.io</a> eller
					använd <a routerLink="/kontakt" class="font-medium text-black underline">kontaktformuläret</a>.
				</p>
			</main>
			<app-site-footer />
		</div>
	`,
})
export class AboutComponent {
	readonly products = PRODUCTS;
}

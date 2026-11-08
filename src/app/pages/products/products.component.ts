import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer.component';
import { SiteHeaderComponent } from '../../shared/site-header.component';
import { PRODUCTS } from '../../shared/site-nav';

@Component({
	selector: 'app-products',
	standalone: true,
	imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
	template: `
		<div class="bg-white text-black">
			<app-site-header />
			<main class="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
				<nav aria-label="Brödsmulor" class="mb-6 text-sm text-black/50">
					<a routerLink="/" class="hover:text-black">Catso</a> <span aria-hidden="true" class="mx-1">/</span> Produkter
				</nav>
				<h1 class="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Produkter från Catso</h1>
				<p class="mt-5 max-w-2xl text-lg text-black/60">
					Det vi bygger är AI-agenter och robotik. Här är produkterna vi driftar själva, och de system och appar vi
					också har byggt.
				</p>

				<h2 class="mt-14 text-2xl font-semibold">AI-agenter och AI för e-handel</h2>
				<ul class="mt-6 grid gap-6 md:grid-cols-2">
					@for (p of ai; track p.path) {
						<li class="flex flex-col rounded-3xl border border-black/10 bg-black/[0.02] p-8">
							<span class="text-xs font-medium uppercase tracking-wide text-black/45">{{ p.audience }}</span>
							<h3 class="mt-2 text-2xl font-semibold">
								<a [routerLink]="p.path" class="hover:underline">{{ p.name }}</a>
							</h3>
							<p class="mt-3 flex-1 text-black/65">{{ p.text }}</p>
							<a
								[routerLink]="p.path"
								class="mt-6 inline-flex h-11 w-fit items-center rounded-2xl bg-black px-5 text-sm font-medium text-white hover:bg-black/85"
								>Läs mer om {{ p.name }}</a
							>
						</li>
					}
				</ul>

				<section class="mt-12 rounded-3xl bg-black p-8 text-white md:p-12">
					<h2 class="text-2xl font-semibold">Robotik och specialbyggda agenter</h2>
					<p class="mt-3 max-w-2xl text-white/65">
						Vi bygger styrningen för autonoma robotflottor, med en digital tvilling av anläggningen som testas i
						simulering innan robotarna körs på riktigt. Vi bygger också AI-agenter för offentlig sektor och
						industri. Det här gör vi som projekt tillsammans med er.
					</p>
					<a
						routerLink="/kontakt"
						class="mt-6 inline-flex h-11 items-center rounded-2xl bg-white px-5 text-sm font-medium text-black hover:bg-white/90"
						>Berätta vad ni behöver</a
					>
				</section>

				<h2 class="mt-14 text-2xl font-semibold">System och appar vi också bygger</h2>
				<ul class="mt-6 grid gap-6 md:grid-cols-2">
					@for (p of other; track p.path) {
						<li class="flex flex-col rounded-3xl border border-black/10 bg-black/[0.02] p-8">
							<span class="text-xs font-medium uppercase tracking-wide text-black/45">{{ p.audience }}</span>
							<h3 class="mt-2 text-2xl font-semibold">
								<a [routerLink]="p.path" class="hover:underline">{{ p.name }}</a>
							</h3>
							<p class="mt-3 flex-1 text-black/65">{{ p.text }}</p>
							<a
								[routerLink]="p.path"
								class="mt-6 inline-flex h-11 w-fit items-center rounded-2xl bg-black px-5 text-sm font-medium text-white hover:bg-black/85"
								>Läs mer om {{ p.name }}</a
							>
						</li>
					}
				</ul>
			</main>
			<app-site-footer />
		</div>
	`,
})
export class ProductsComponent {
	readonly ai = PRODUCTS.filter((p) => p.group === 'ai');
	readonly other = PRODUCTS.filter((p) => p.group === 'other');
}

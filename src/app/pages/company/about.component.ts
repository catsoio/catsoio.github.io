import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer.component';
import { SiteHeaderComponent } from '../../shared/site-header.component';

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
					Catso AI &amp; Robotics bygger AI-agenter och robotik för svenska företag och myndigheter. Vi tar de
					tunga arbetsflödena, de som består av att läsa, söka, skriva och flytta saker, och låter en agent eller en
					robot göra dem.
				</p>

				<h2 class="mt-12 text-2xl font-semibold">Vad vi gör</h2>
				<ul class="mt-4 space-y-4 text-black/65">
					<li>
						<strong class="text-black">AI-agenter.</strong> Vår första är
						<a routerLink="/vera-01" class="font-medium text-black underline">VERA-01</a>, byggd för svenska
						advokatbyråer. Den analyserar ärenden, tar fram utkast och söker i rättskällor, och körs lokalt hos er.
						Näst ut är agenter för offentlig sektor och industri.
					</li>
					<li>
						<strong class="text-black">Robotik.</strong> Vi bygger styrningen för autonoma robotflottor. Jobbet börjar
						med en digital tvilling av er anläggning, så att allt testas i simulering innan en robot rör sig på golvet.
					</li>
					<li>
						<strong class="text-black">AI för e-handel.</strong> Vi är officiell Shopify-partner, och
						<a routerLink="/shopify/apps/ai-search" class="font-medium text-black underline">Catso AI Sök</a>
						är en sökning som förstår vad kunden menar.
					</li>
				</ul>

				<h2 class="mt-12 text-2xl font-semibold">Så arbetar vi</h2>
				<ul class="mt-3 list-disc space-y-2 pl-5 text-black/65">
					<li>Byggt i Sverige, med datahantering inom EU.</li>
					<li>AI-agenter som körs lokalt eller i svensk molnregion, så att er data stannar i er miljö.</li>
					<li>Agenterna tränas på svenska datakällor och regelverk och kopplas till era befintliga system.</li>
					<li>Robotar testas i simulering med en digital tvilling innan de körs på riktigt.</li>
				</ul>

				<h2 class="mt-12 text-2xl font-semibold">Vi bygger också egna system och appar</h2>
				<p class="mt-3 text-black/65">
					Vid sidan av AI och robotik har vi byggt och driftar verkstadssystemet
					<a routerLink="/apps/axle" class="font-medium text-black underline">Catso Axle</a> samt apparna
					<a routerLink="/hemmafest" class="font-medium text-black underline">Hemmafest</a> och
					<a routerLink="/poangjakten/sponsor" class="font-medium text-black underline">Poängjakten</a>. Se alla på
					<a routerLink="/produkter" class="font-medium text-black underline">produktsidan</a>.
				</p>

				<h2 class="mt-12 text-2xl font-semibold">Hör av dig</h2>
				<p class="mt-3 text-black/65">
					Har ni ett arbetsflöde som tar för mycket tid, eller en anläggning som ska automatiseras? Mejla
					<a href="mailto:support&#64;catso.io" class="font-medium text-black underline">support&#64;catso.io</a> eller
					använd <a routerLink="/kontakt" class="font-medium text-black underline">kontaktformuläret</a>.
				</p>
			</main>
			<app-site-footer />
		</div>
	`,
})
export class AboutComponent {
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer.component';
import { SiteHeaderComponent } from '../../shared/site-header.component';

/**
 * Policyn för catso.io. Den ska stämma med vad koden gör: kontaktformuläret (`POST /api/contact`)
 * och besöksloggen (`POST /api/contact/visit`, `site_visits`, raderas efter 395 dagar).
 * Ändrar du någon av dem, ändra här.
 */
@Component({
	selector: 'app-integritet',
	standalone: true,
	imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
	template: `
		<div class="bg-white text-black">
			<app-site-header />
			<main class="mx-auto max-w-3xl px-4 py-14 md:py-20">
				<h1 class="text-4xl font-semibold tracking-tight">Integritetspolicy för catso.io</h1>
				<p class="mt-4 text-black/65">
					Så hanterar Catso AI &amp; Robotics personuppgifter när du besöker catso.io eller kontaktar oss. Policyn
					gäller inte våra produkter: Hemmafest har
					<a routerLink="/hemmafest/privacy" class="underline">en egen policy</a>, och för Catso Axle och övriga
					system gäller avtalet med den verksamhet som använder dem.
				</p>

				<h2 class="mt-10 text-2xl font-semibold">Vem ansvarar</h2>
				<p class="mt-3 text-black/65">
					Catso AI &amp; Robotics är personuppgiftsansvarig. Du når oss på
					<a href="mailto:support@catso.io" class="underline">support&#64;catso.io</a>.
				</p>

				<h2 class="mt-10 text-2xl font-semibold">Vilka uppgifter vi sparar och varför</h2>
				<h3 class="mt-5 text-lg font-semibold">När du skickar ett meddelande</h3>
				<p class="mt-2 text-black/65">
					Namn, e-postadress, företag, telefonnummer (om du anger det) och meddelandet. Vi använder dem för att
					svara dig och följa upp din förfrågan. Meddelandet skickas som e-post till oss och ligger i vår brevlåda
					så länge vi behöver det för att svara och följa upp. Grunden är vårt berättigade intresse av att besvara
					frågor från dem som hör av sig.
				</p>
				<h3 class="mt-5 text-lg font-semibold">När du besöker sidan</h3>
				<p class="mt-2 text-black/65">
					Vi loggar ett besök per webbläsarsession: IP-adress, ungefärlig plats (land, region och stad), nätverk
					eller internetleverantör, vilken sida du kom till, var du kom ifrån, webbläsare och tid. Platsen slår vi
					upp med din IP-adress hos tjänsten ipwho.is. Vi använder det för att förstå vilka som hittar oss och
					vilka sidor som fungerar. Besöksloggen kan bara läsas av oss, och raderas automatiskt efter 13 månader.
					Grunden är vårt berättigade intresse av att följa hur webbplatsen används. Trafik från kända bots och
					våra egna besök sparas inte.
				</p>
				<p class="mt-3 text-black/65">Vi använder inga reklam- eller spårningskakor på catso.io.</p>

				<h2 class="mt-10 text-2xl font-semibold">Vilka som får uppgifterna</h2>
				<p class="mt-3 text-black/65">
					Vi säljer aldrig uppgifter. De hanteras av leverantörer som hjälper oss att driva sidan: hosting (GitHub
					Pages, Fly.io och Cloudflare), e-post (Microsoft) och platsuppslaget (ipwho.is).
				</p>

				<h2 class="mt-10 text-2xl font-semibold">Dina rättigheter</h2>
				<p class="mt-3 text-black/65">
					Du kan be om att få veta vilka uppgifter vi har om dig, få dem rättade eller raderade, invända mot
					behandlingen och begära att få ut dem. Mejla
					<a href="mailto:support@catso.io" class="underline">support&#64;catso.io</a>. Du kan också klaga hos
					Integritetsskyddsmyndigheten (IMY).
				</p>
			</main>
			<app-site-footer />
		</div>
	`,
})
export class IntegritetComponent {}

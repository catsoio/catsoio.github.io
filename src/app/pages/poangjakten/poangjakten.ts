import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-poangjakten',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './poangjakten.html',
	styles: [
		`
			@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Patrick+Hand+SC&display=swap');
			.font-display {
				font-family: 'Patrick Hand SC', system-ui, sans-serif;
				letter-spacing: 0.01em;
			}
			.font-hand {
				font-family: 'Patrick Hand', system-ui, sans-serif;
			}
			.grid-bg {
				background-image: radial-gradient(
					circle at 1px 1px,
					rgba(0, 0, 0, 0.05) 1px,
					transparent 0
				);
				background-size: 24px 24px;
			}
		`,
	],
})
export class Poangjakten {
	openFaq = signal<number | null>(0);

	toggleFaq(i: number): void {
		this.openFaq.set(this.openFaq() === i ? null : i);
	}

	scrollTo(id: string): void {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	zones = [
		{
			type: 'Hero-exponering',
			title: 'Presenting Partner',
			desc: 'Er logga och ert budskap ligger statiskt på startsidan (Challenge-vyn) som varje elev ser när de kollar poängställningen flera gånger om dagen.',
			metric: 'Visningar (Impressions) vid varje inloggning',
		},
		{
			type: 'Spotlight-utmaning',
			title: 'Sponsrat Uppdrag',
			desc: 'Ni äger ett specifikt uppdrag i appen. Elever klickar in, läser instruktionerna, utför uppdraget fysiskt, och skickar in beviset (videolänk).',
			metric: 'Antal utförda uppdrag + organisk räckvidd på sociala medier',
		},
		{
			type: 'Direkt konvertering',
			title: 'Erbjudanden & Rabatter',
			desc: 'Direkt koppling till köp via appens erbjudandeflik. Ni kan dela ut unika engångskoder till elever som utfört ett visst uppdrag.',
			metric: 'Klick till webbplats / Använda rabattkoder (CPA)',
		},
	];

	tiers = [
		{
			name: 'Spotlight Regional',
			price: 'Från 30.000 SEK',
			reach: 'Lokalt (T.ex. Norrbotten, 5-10 skolor)',
			features: [
				'1 Skräddarsytt uppdrag i appen',
				'Er logga inne i uppdragsvyn',
				'Rätt till specifik hashtag',
				'Månadsrapport på engagemang',
			],
			cta: 'Boka möte',
			highlight: false,
		},
		{
			name: 'Platinum Nationell',
			price: 'Från 150.000 SEK',
			reach: 'Rikstäckande (Studenten 2026)',
			features: [
				'Presenting Partner på startsidan',
				'Obegränsat antal sponsrade uppdrag',
				'Förtur på utformning av uppdrag',
				'Real-tids dashboard med analytics',
				'Möjlighet till direkta rabattkoder',
			],
			cta: 'Begär offert',
			highlight: true,
		},
		{
			name: 'Performance / Förmån',
			price: 'Revenue Share / CPA',
			reach: 'Erbjudandefliken',
			features: [
				'Placering i dedikerad erbjudandevy',
				'Spårbara klick och konverteringar',
				'Perfekt för e-handel eller lokala butiker',
				'Endast betalning för faktiskt värde',
			],
			cta: 'Kontakta oss',
			highlight: false,
		},
	];

	faqs = [
		{
			q: 'Hur vet ni att ni når 100 000+ studenter?',
			a: 'Enligt SCB går cirka 100 000 elever ut gymnasiet varje år i Sverige. Poängjakten är en av de mest utbredda inofficiella traditionerna under vårterminen. Vårt mål med lanseringen HT26 är att initialt digitalisera traditionen för de största skolorna nationellt, och därefter skala upp.',
		},
		{
			q: 'Kan vi själva skapa utmaningar?',
			a: 'Ja, det är hela poängen för Platinum/Regional-partners. Ni föreslår, vi och skolkommittén godkänner (så det är lagligt och lämpligt), sedan är det live. Det är dock alltid skolkommittén som har sista ordet kring vad som publiceras för deras skola.',
		},
		{
			q: 'Vad gäller kring GDPR och åldersgränser?',
			a: 'Appen är strikt "Privacy by Design". Eleverna är 16–19 år. För användare under 18 år krävs vårdnadshavares samtycke vid registrering, vilket vi löser tekniskt. Ni som sponsor rör aldrig elevdata direkt — ni får endast aggregerad statistik och mätvärden.',
		},
		{
			q: 'Kan vi testa lokalt innan vi gör en rikstäckande kampanj?',
			a: 'Absolut, det är vår rekommendation! Starta med 5-10 skolor i en specifik region (Spotlight-paketet), mät engagemanget och konverteringen, och skala sedan upp samarbetet nationellt året därpå.',
		},
	];
}

import { Component } from '@angular/core';

interface Feature {
	title: string;
	subtitle: string;
	description: string;
	imageUrl: string;
	detail: string;
	tags: string[];
}

@Component({
	selector: 'app-why-local-agent',
	standalone: true,
	imports: [],
	templateUrl: './why-local-agent.component.html',
	styleUrl: './why-local-agent.component.scss',
})
export class WhyLocalAgentComponent {
	activeFeature: Feature | null = null;

	open(feature: Feature): void {
		this.activeFeature = feature;
	}

	close(): void {
		this.activeFeature = null;
	}

	public features: Feature[] = [
		{
			title: 'Total sekretess',
			subtitle: 'Er data lämnar aldrig byrån.',
			imageUrl: 'assets/imgs/gdpr.png',
			tags: ['VRGA 2.2', 'GDPR', 'Kap. 5c'],
			description:
				'Tystnadsplikt, GDPR och tredjelandsöverföring — löst genom en enda arkitektur: lokal drift. Ingen molnleverantör, ingen träning på er data, ingen risk.',
			detail:
				'Advokatsamfundets vägledning (2025) kräver att klientinformation inte får användas för träning eller utdata till andra, att personuppgifter inte överförs till tredje land utan skyddsåtgärder, och att advokaten granskar leverantörens sekretessvillkor. VERA-01 eliminerar samtliga risker genom att köras helt lokalt — ingen data lämnar er infrastruktur, inga promptar skickas till externa API:er, och modellen tränas aldrig på ert material.',
		},
		{
			title: 'Juridisk precision',
			subtitle: 'Varje svar grundat i rättskällor.',
			imageUrl: 'assets/imgs/books.jpg',
			tags: ['VRGA 2.1.2', 'VRGA 2.5'],
			description:
				'Källhänvisningar till lagrum, praxis och förarbeten. Riskflaggning av oklara klausuler. Från timmar till minuter — utan att tumma på metoden.',
			detail:
				'Advokatens råd ska vara grundade på erforderliga undersökningar av gällande rätt, och rådgivningsansvaret gäller fullt ut oavsett om rådet baseras på GenAI. VERA-01 refererar alltid till specifika lagrum, rättsfall och förarbeten så att advokaten kan verifiera varje slutsats. Systemet flaggar otydliga formuleringar och dolda risker — och gör det på minuter istället för timmar.',
		},
	];
}

import { Component } from '@angular/core';

type Stat = {
	label: string; // Rubrik, t.ex. "Korrekthet med källhänvisning (30d)"
	value: string; // Huvudtal, t.ex. "97-99 %"
	sublabel?: string; // Sekundär rad, t.ex. "Praxis löpande • Latens <24 h"
	footnote?: string; // Tooltip med mätmetod/källa
};

@Component({
	selector: 'app-how-vera-works',
	standalone: true,
	imports: [],
	templateUrl: './how-vera-works.component.html',
	styleUrl: './how-vera-works.component.scss',
})
export class HowVeraWorksComponent {
	// Exempelvärden — byt till dina telemetridata
	stats: Stat[] = [
		{
			label: 'Korrekthet med källhänvisning (30 dagar)',
			value: '97-99 %',
			footnote:
				'30-dagars rullande. Blind juristgranskning (N≥100/30d, ≥2 granskare). Korrekt slutsats + korrekt citerat lagrum/praxis.',
		},
		{
			label: 'Uppdaterad till',
			value: 'SFS t.o.m. 2025-09-15',
			sublabel: 'Praxis löpande • Indekseringslatens < 24 h',
			footnote:
				'Automatiskt diff mot publiceringsdatum i SFS; medianlatens senaste 30 dagar.',
		},
		{
			label: 'Svarstid (P95)',
			value: '≤ 2,3 s',
			sublabel: 'Till första citerade slutsats i UI',
			footnote:
				'Uppmätt i klienttelemetri över verkliga ärenden; percentiler P50/P95.',
		},

		// Vill du visa fler? Avkommentera nedan.
		// {
		//   label: 'Hallucinationsgrad (30 dagar)',
		//   value: '< 1,0 %',
		//   footnote:
		//     'Andel svar med sakfel/icke-existerande källor enligt blind juristgranskning (N≥100/30d).'
		// },
		// {
		//   label: 'Rättskälletäckning',
		//   value: 'Samtliga SFS • NJA/HFD • EU',
		//   sublabel: 'Index uppdateras dagligen/veckovis',
		//   footnote: 'Antal författningar och avgöranden räknas i pipeline vid varje körning.'
		// },
		// {
		//   label: 'Tidsbesparing per ärende',
		//   value: '−38 min',
		//   sublabel: 'Före/efter hos pilotkunder (4 v)',
		//   footnote: 'Självrapporterad tidsstudie; viktat snitt.'
		// },
	];
}

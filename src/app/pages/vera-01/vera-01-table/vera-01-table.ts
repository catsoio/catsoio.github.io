import { Component } from '@angular/core';

@Component({
	selector: 'app-vera-01-table',
	imports: [],
	templateUrl: './vera-01-table.html',
	styleUrl: './vera-01-table.scss',
})
export class Vera01Table {
	aiComparison = [
		{
			title: 'Datasekretess & GDPR',
			description: 'Var processas och lagras egentligen informationen?',
			chatgpt: 'Datan skickas ofta till servrar utanför EU (USA).',
			vera: '100% GDPR-säker. Svenska servrar eller helt offline hos er.',
		},
		{
			title: 'Modellträning & Klientdata',
			description: 'Används er inmatade data för att göra AI:n smartare?',
			chatgpt: 'Stor risk att känslig data används som träningsdata.',
			vera: 'Stängd miljö (Zero Data Retention). Er data tränar aldrig modellen.',
		},
		{
			title: 'Juridisk precision',
			description: 'Förståelse för lagrum och domstolars praxis.',
			chatgpt: 'Generell modell. Hög risk för hallucinerade (ofta amerikanska) lagrum.',
			vera: 'Specialtränad för svensk rättspraxis och juridiskt metodarbete.',
		},
		{
			title: 'Kapacitet (Kontextfönster)',
			description: 'Förmågan att läsa in stora FUP:ar och akter på en gång.',
			chatgpt: 'Tappar tråden eller kraschar vid hundratals sidor.',
			vera: 'Skräddarsydd för massiv dokumenthantering. Klarar tusentals sidor i en inläsning.',
		},
		{
			title: 'Källhänvisningar',
			description: 'Kan du lita på att AI:ns påståenden stämmer?',
			chatgpt: 'Hittar ofta på sidnummer som inte existerar.',
			vera: 'Genererar exakta, klickbara sidhänvisningar direkt in i originalakten.',
		},
	];
}

import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

const PRODUCT_NAME = 'Catso Verkstad';
const IMG = '/assets/imgs/manual';

interface Step {
	title: string;
	/** En kort mening om vad steget är till för. */
	intro: string;
	/** Vad man gör, i ordning. Korta meningar. */
	todo: string[];
	image: string;
	alt: string;
	/** Vad de gula siffrorna i bilden betyder. */
	marks: string[];
}

/**
 * Manual: kort och enkel svenska, en bild per steg. Läsaren är ofta en verkstadsägare som inte
 * har svenska som första språk och inte vill läsa mycket. Meningarna ska vara korta, och varje
 * steg ska gå att göra med bilden bredvid sig.
 */
@Component({
	selector: 'app-kom-igang',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: './kom-igang.component.html',
	styleUrl: './kom-igang.component.scss',
})
export class KomIgangComponent {
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	readonly product = PRODUCT_NAME;
	readonly currentYear = new Date().getFullYear();

	readonly prepare = [
		'Organisationsnummer och momsnummer',
		'Adress och bankgiro (eller Swish)',
		'Namn och e-post till dem som ska använda systemet',
		'Er prislista',
	];

	readonly steps: Step[] = [
		{
			title: 'Företaget',
			intro: 'Skriv in uppgifterna om ert företag. De står på alla fakturor och kvitton.',
			todo: [
				'Tryck på kugghjulet uppe till höger.',
				'Tryck på Företaget (1).',
				'Skriv namn, organisationsnummer, momsnummer, adress och bankgiro.',
				'Tryck på Spara.',
			],
			image: `${IMG}/1-foretag.webp`,
			alt: 'Inställningar, fliken Företaget',
			marks: ['Fliken Företaget'],
		},
		{
			title: 'Personal',
			intro: 'Lägg till dem som ska använda systemet.',
			todo: [
				'Tryck på kugghjulet och sedan på Personal (1).',
				'Tryck på Skapa inbjudningskod (2).',
				'Skicka koden till personen. Hen skapar ett konto med koden.',
				'Välj roll: Personal eller Mekaniker.',
			],
			image: `${IMG}/2-personal.webp`,
			alt: 'Inställningar, fliken Personal',
			marks: ['Fliken Personal', 'Skapa kod till en ny person'],
		},
		{
			title: 'Mekaniker och platser',
			intro: 'Lägg in de som arbetar i verkstaden, och lyftarna. Då syns de i kalendern.',
			todo: ['Tryck på Mekaniker och platser i menyn.', 'Tryck på Ny (1).', 'Skriv namn. Välj Mekaniker eller Lyft. Välj en färg.'],
			image: `${IMG}/3-mekaniker.webp`,
			alt: 'Listan över mekaniker och platser',
			marks: ['Ny mekaniker eller plats'],
		},
		{
			title: 'Åtgärder och priser',
			intro: 'Det här är er prislista. Vanliga jobb finns redan. Ni skriver bara priset.',
			todo: ['Tryck på Åtgärder i menyn.', 'Tryck på en rad och skriv pris och tid.', 'Tryck på Ny åtgärd (1) om något saknas.'],
			image: `${IMG}/4-atgarder.webp`,
			alt: 'Listan över åtgärder med priser',
			marks: ['Ny åtgärd'],
		},
		{
			title: 'Däck i lager',
			intro: 'Lägg in däcken ni säljer. Börja med de som ni säljer mest. Resten kan komma senare.',
			todo: ['Tryck på Artiklar i menyn.', 'Tryck på Ny (1).', 'Skriv märke, storlek, pris och hur många ni har.'],
			image: `${IMG}/5-artiklar.webp`,
			alt: 'Listan över artiklar i lagret',
			marks: ['Ny artikel'],
		},
		{
			title: 'Boka en tid',
			intro: 'Gör en bokning när kunden ringer. Det tar en halv minut.',
			todo: [
				'Tryck på Ny bokning uppe i raden.',
				'Skriv kundens namn eller telefonnummer. Skriv registreringsnumret.',
				'Skriv vad som ska göras. Välj dag och tid.',
				'Tryck på Spara (1).',
			],
			image: `${IMG}/6-bokning.webp`,
			alt: 'Dialogen Ny bokning',
			marks: ['Spara bokningen'],
		},
		{
			title: 'Sälja och göra faktura',
			intro: 'Allt kunden ska betala skriver ni i en Ny försäljning. Sedan bokför ni den.',
			todo: [
				'Tryck på Ny försäljning uppe i raden.',
				'Välj kund. Lägg till däck och arbete.',
				'Välj Faktura (kunden betalar senare) eller Kvitto (kunden betalar nu).',
				'Tryck på Bokför (1). Efter det går det inte att ändra.',
			],
			image: `${IMG}/7-forsaljning.webp`,
			alt: 'Säljkort med valet Faktura eller Kvitto',
			marks: ['Bokför'],
		},
		{
			title: 'Se vem som har betalat',
			intro: 'Här ser ni alla fakturor. Röd betyder att kunden är sen.',
			todo: ['Tryck på Ekonomi och sedan på Fakturor.', 'Se Förfallet (1): det är pengar som kunden är sen med.', 'När kunden betalar: öppna fakturan och tryck Markera betald.'],
			image: `${IMG}/8-fakturor.webp`,
			alt: 'Fakturalistan',
			marks: ['Förfallet', 'Ny faktura'],
		},
	];

	print(): void {
		if (this.browser) window.print();
	}
}

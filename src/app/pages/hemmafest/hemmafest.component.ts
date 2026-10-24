import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-hemmafest',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './hemmafest.component.html',
	styleUrl: './hemmafest.component.scss',
})
export class HemmafestComponent {
	readonly appStoreUrl = 'https://apps.apple.com/se/app/hemmafest/id6736556918?uo=2';
	readonly webAppUrl = 'https://hemmafest.catso.io';

	steps = [
		{ n: '1', title: 'swipa', body: 'Bläddra bland fester nära dig. Svep höger på de du vill på.' },
		{ n: '2', title: 'fråga', body: 'Skicka en förfrågan. Värden bestämmer vilka som kommer in.' },
		{ n: '3', title: 'festa', body: 'Chatta med gänget, checka in på plats och betygsätt efteråt.' },
	];

	safety = [
		{ title: 'Rapportera på två tryck', body: 'Från profil, fest eller chatt.' },
		{ title: 'Adressen är privat', body: 'Den visas bara för de som är med i festen.' },
		{ title: 'Blockera när du vill', body: 'Ingen kan skriva eller hitta dig efteråt.' },
		{ title: 'Betyg och märken', body: 'Se vilka som är bra värdar och gäster.' },
	];

	faqs = [
		{
			q: 'Hur använder jag Hemmafest på Android?',
			a: 'Öppna webbappen i Chrome, tryck på menyn och välj "Lägg till på startskärmen". Då funkar den som en vanlig app. Play Store-versionen kommer senare.',
		},
		{
			q: 'Kostar det något?',
			a: 'Nej, du kan använda appen gratis. Hemmafest+ ger dig extra, som obegränsat med förfrågningar.',
		},
		{
			q: 'Hur raderar jag mitt konto?',
			a: 'Under Inställningar i appen, eller via formuläret på sidan "Begär radering av konto".',
		},
		{
			q: 'Behöver jag ett konto?',
			a: 'Ja, för att skapa fester, skicka förfrågningar och chatta.',
		},
	];
}

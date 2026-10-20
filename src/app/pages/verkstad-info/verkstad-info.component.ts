import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Produktnamnet står på samma sätt som på sidan /apps/verkstad. */
const PRODUCT_NAME = 'Catso Verkstad';

interface Step {
	where: string;
	title: string;
	text: string;
	chips?: string[];
	prints?: string[];
}

/**
 * Så hänger systemet ihop: en karta över korten och de vanligaste händelserna steg för steg.
 * Samma innehåll som den interna genomgången, för att kunna visas för en kund.
 */
@Component({
	selector: 'app-verkstad-info',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: './verkstad-info.component.html',
	styleUrl: './verkstad-info.component.scss',
})
export class VerkstadInfoComponent {
	readonly product = PRODUCT_NAME;
	readonly currentYear = new Date().getFullYear();

	readonly codes = [
		['KU-0001', 'kund'],
		['BIL-0001', 'bil'],
		['TID-00001', 'bokning'],
		['AO-00001', 'arbetsorder'],
		['SK-00001', 'säljkort'],
		['FAK-00001', 'faktura eller kvitto'],
		['DH-0001', 'däckhotell'],
		['ART-00001', 'artikel'],
	];

	readonly job: Step[] = [
		{
			where: 'Tidsbokning',
			title: 'Bokningen läggs in',
			text: 'Kund, bil, tid, mekaniker och plats. Rutan "Skapa arbetsorder när jag sparar" gör arbetsordern direkt.',
			chips: ['TID-00012'],
		},
		{
			where: 'Arbetsorder',
			title: 'Arbetsordern listar vad som ska göras',
			text: 'En rad per sak. Saknas en del markerar du raden, se händelsen "En del saknas" nedan. Mekanikern ser inga priser.',
			chips: ['AO-00002'],
			prints: ['Arbetsblad utan pris'],
		},
		{
			where: 'Verkstadsgolvet',
			title: 'Mekanikern jobbar från utskriften',
			text: 'Regnumret står störst, sedan kund, checklista med instruktioner, en ruta för mekanikerns anteckningar och en rad för signatur. När jobbet är klart sätts ordern till Klar.',
		},
		{
			where: 'Arbetsorder, sedan säljkort',
			title: 'Du skapar säljkortet',
			text: 'Knappen "Skapa säljkort" tar med kund, bil och det överenskomna priset. Här lägger du till fler rader och ger eventuell rabatt.',
			chips: ['SK-00001'],
		},
		{
			where: 'Säljkort',
			title: 'Du bokför kortet',
			text: 'Privatkund får kvitto, företag får faktura. Artiklar på raderna tas ur lagret. Därefter kan kortet inte ändras.',
			chips: ['FAK-00001'],
			prints: ['Kvitto eller faktura, A4'],
		},
		{
			where: 'Säljkort',
			title: 'Betalningen markeras',
			text: 'Välj betalsätt (kort, kontant, Swish eller faktura) och markera betald. Står den kvar som obetald syns den i listan över obetalda.',
		},
	];

	readonly counter: Step[] = [
		{
			where: 'Försäljning',
			title: 'Nytt säljkort',
			text: 'Kunden kan vara vald ur registret eller lämnas tom för en kontantkund. Sök artikeln på storlek eller märke, så fylls priset i (inklusive moms).',
			chips: ['SK-00002'],
		},
		{
			where: 'Säljkort',
			title: 'Bokför och ta betalt',
			text: 'Lagret minskar med det som såldes, kvittot får sitt nummer och du markerar hur kunden betalade.',
			chips: ['FAK-00002'],
			prints: ['Kvitto'],
		},
	];

	readonly hotel: Step[] = [
		{
			where: 'Däckhotell',
			title: 'Fyra inlämningar, en per bil',
			text: 'Regnummer, däck eller fälgar, hylla och avgift (här 995 kr per bil). Varje inlämning får ett nummer som står på etiketten.',
			chips: ['DH-0001 till DH-0004'],
			prints: ['Etikett med numret'],
		},
		{
			where: 'Säljkort',
			title: 'Ett säljkort för kunden',
			text: 'Under "Däckhotell" på säljkortet listas kundens obetalda inlämningar. Du lägger till alla fyra, en rad per bil.',
			chips: ['SK-00003'],
		},
	];

	readonly hotelEnd: Step[] = [
		{
			where: 'Säljkort',
			title: 'Bokför och markera betald',
			text: 'Kvittot visar fyra rader och rabatten. När kortet markeras betalt blir alla fyra inlämningarna betalda på en gång.',
			chips: ['FAK-00003'],
			prints: ['Kvitto'],
		},
		{
			where: 'Däckhotell',
			title: 'Dagen kunden hämtar',
			text: 'Varje bil lämnas ut för sig på sitt kort. Den som bara har en bil gör samma sak med en rad och ingen rabatt: knappen "Lägg på säljkort" finns på däckhotellskortet.',
		},
	];

	readonly printouts = [
		{
			name: 'Arbetsblad',
			code: 'AO-…',
			who: 'Mekanikern',
			what: 'Regnumret störst, kund och telefon, datum, checklista med instruktioner, markering för del som saknas, ruta för anteckningar och signatur. Inga priser.',
		},
		{
			name: 'Kvitto eller faktura',
			code: 'FAK-…',
			who: 'Kunden',
			what: 'Verkstadens och kundens uppgifter, rader med antal, pris och rabatt, moms per sats, att betala, garanti och betalningsuppgifter. A4.',
		},
		{
			name: 'Utkast',
			code: 'SK-…',
			who: 'Er, för kontroll',
			what: 'Samma dokument, märkt "Utkast – ej bokfört", innan kortet bokförs. Inget nummer tas.',
		},
		{
			name: 'Däckhotell',
			code: 'DH-…',
			who: 'Hyllan och kunden',
			what: 'Utskrift med numret för etiketten på däcken.',
		},
	];

	readonly exists = [
		'Kunder, bilar och bokningar, med kopplingar till varandra',
		'Arbetsorder med utskrivbart, prisfritt arbetsblad',
		'Säljkort med rader, rabatt på rad och på hela kortet, bokföring, kvitto, faktura och betalning',
		'Däckhotell som läggs på säljkort, också flera bilar åt gången',
		'Lager som minskar när ett kort bokförs',
		'Priser inklusive moms, moms per sats och momsrapport',
		'Inköp som sida: leverantör, artiklar, lagret ökar',
	];

	readonly soon = [
		'Inköpskort: beställning, mottagning och leverantörsfaktura med ingående moms',
		'"Del saknas" som blir en rad på ett inköpskort',
		'Kreditfaktura för retur och fel',
		'Rabatt som bara ägaren får ge, om ni vill det',
	];
}

import type { Faq } from '../../seo/faq.data';

/**
 * Innehållet på modulsidorna under /axle/<modul>. Texten beskriver bara det som finns i Axle idag.
 * Det som inte är byggt står inte här (se "Ej byggt" i Axles CLAUDE.md).
 */

export interface ModulBlock {
	title: string;
	text: string;
}

export interface ModulImage {
	src: string;
	alt: string;
	/** Mobilbild som läggs vid sidan av skärmbilden. */
	phone?: { src: string; alt: string };
}

export interface Modul {
	slug: string;
	/** Namnet i menyer och länkar. */
	name: string;
	/** Sidans rubrik (h1). */
	h1: string;
	/** En kort rad under rubriken. */
	lead: string;
	/** Titel och beskrivning för sökresultat. Titeln nämner Catso, så den får inget suffix. */
	seoTitle: string;
	seoDescription: string;
	/** Fotot bakom rubriken, och dess object-position. */
	photo: string;
	pos?: string;
	image?: ModulImage;
	/** Det sidan visar: fyra eller fem block. */
	blocks: ModulBlock[];
	faqs: Faq[];
	/** Slug på de moduler som länkas under "Mer i Axle". */
	related: string[];
}

const IMG = '/assets/imgs/axle';

export const MODULER: Modul[] = [
	{
		slug: 'dackhotell',
		name: 'Däckhotell',
		h1: 'Full koll på däckhotellet',
		lead: 'Se vilka däckset som står var, vilka som ska hämtas och vilka som inte är betalda.',
		seoTitle: 'Däckhotell för verkstäder | Catso Axle',
		seoDescription:
			'Däckhotell i Catso Axle: set med regnummer och hylla, etikett, hämtningar per vecka, SMS-inkallning och en lista över kunder med slitna däck att ringa.',
		photo: `${IMG}/photos/dackhotell.jpg`,
		pos: 'center',
		image: {
			src: `${IMG}/app-hotellov.jpg`,
			alt: 'Översikten för däckhotellet med hämtningar per vecka, hyllor och mönsterdjup',
		},
		blocks: [
			{
				title: 'Hitta varje set',
				text: 'Registreringsnummer, hylla och mönsterdjup direkt på skärmen.',
			},
			{
				title: 'Etikett till varje set',
				text: 'Skriv ut en etikett med QR-kod och sätt på hjulen.',
			},
			{
				title: 'Se vad som väntar',
				text: 'Hämtningar per vecka och de set som borde ha hämtats.',
			},
			{
				title: 'Kalla in med SMS',
				text: 'Skriv texten en gång och skicka till alla ni väljer.',
			},
			{
				title: 'Ring rätt kunder',
				text: 'Se vilka däck som är slitna och ring kunderna.',
			},
		],
		faqs: [
			{
				q: 'Skickas inkallningen automatiskt?',
				a: 'Nej. Ni väljer vilka som ska få SMS.',
			},
			{
				q: 'Kan kunden betala med faktura?',
				a: 'Ja.',
			},
			{
				q: 'Hur hittar vi ett set?',
				a: 'Sök på regnummer, namn, telefonnummer eller hylla.',
			},
		],
		related: ['tidsbokning', 'lager', 'arbetsorder'],
	},
	{
		slug: 'tidsbokning',
		name: 'Tidsbokning',
		h1: 'Boka in bilar med ett klick',
		lead: 'Se alla mekaniker och lyft i samma vy, och klicka på en ledig tid.',
		seoTitle: 'Tidsbokning för verkstäder | Catso Axle',
		seoDescription:
			'Tidsbokning i Catso Axle: en kolumn per mekaniker och lyft, bokningar som blir arbetsorder och en bokningssida där kunden ser pris för sin bil.',
		photo: `${IMG}/photos/verkstad.jpg`,
		pos: 'center',
		image: {
			src: `${IMG}/app-resurser.jpg`,
			alt: 'Tidsbokningen med en kolumn per mekaniker och lyft',
		},
		blocks: [
			{
				title: 'Dagen på ett ställe',
				text: 'En kolumn per mekaniker och lyft.',
			},
			{
				title: 'Boka direkt i telefon',
				text: 'Skriv telefonnumret så hittas kunden.',
			},
			{
				title: 'Dra och släpp',
				text: 'Flytta en order till rätt mekaniker och tid.',
			},
			{
				title: 'Bokning blir arbetsorder',
				text: 'Ändrar ni tiden följer ordern med.',
			},
			{
				title: 'Kunden skickar en förfrågan',
				text: 'Från er webbplats. Ni bekräftar tiden.',
			},
		],
		faqs: [
			{
				q: 'Kan kunden boka en exakt tid själv?',
				a: 'Nej. Kunden väljer dag och förmiddag eller eftermiddag, och ni bekräftar tiden.',
			},
			{
				q: 'Behöver vi en webbplats?',
				a: 'Ja, för bokningssidan. Vi sätter upp den åt er.',
			},
			{
				q: 'Kan ett jobb gå över flera dagar?',
				a: 'Ja.',
			},
		],
		related: ['arbetsorder', 'dackhotell', 'offert'],
	},
	{
		slug: 'offert',
		name: 'Offert',
		h1: 'Snabba offerter som kunden godkänner',
		lead: 'Skicka offerten som SMS eller mejl. Kunden trycker Godkänn, och ni ser svaret direkt.',
		seoTitle: 'Offert som kunden godkänner | Catso Axle',
		seoDescription:
			'Offert i Catso Axle: kostnadsförslag som SMS eller mejl, kunden godkänner med en länk i mobilen och en godkänd offert blir en arbetsorder.',
		photo: `${IMG}/photos/offert.jpg`,
		pos: 'center 30%',
		image: {
			src: `${IMG}/app-offert.jpg`,
			alt: 'Offerten med status Väntar på svar och när kunden öppnade länken',
			phone: {
				src: `${IMG}/app-kundsida.jpg`,
				alt: 'Kundens sida i mobilen med knappen Godkänn',
			},
		},
		blocks: [
			{
				title: 'Skicka på sekunder',
				text: 'SMS eller mejl, med en text ni kan ändra.',
			},
			{
				title: 'Kunden svarar med ett tryck',
				text: 'Godkänn eller avböj.',
			},
			{
				title: 'Se när den öppnats',
				text: 'Ni ser när offerten öppnades och vad kunden svarade.',
			},
			{
				title: 'Blir arbetsorder',
				text: 'En godkänd offert blir en arbetsorder med jobb och rader.',
			},
		],
		faqs: [
			{
				q: 'Måste kunden ha ett konto?',
				a: 'Nej.',
			},
			{
				q: 'Vad händer när giltigheten har gått ut?',
				a: 'Offerten visas som utgången. Ni kan lämna den igen.',
			},
			{
				q: 'Behöver vi en offert för ett litet jobb?',
				a: 'Nej. Då räcker en arbetsorder.',
			},
		],
		related: ['arbetsorder', 'tidsbokning', 'lager'],
	},
	{
		slug: 'lager',
		name: 'Lager',
		h1: 'Full kontroll på lagret',
		lead: 'Inköp, saldo, inventering och beställningar på ett ställe, med verktyg för däck.',
		seoTitle: 'Lager och inköp för verkstäder | Catso Axle',
		seoDescription:
			'Lager i Catso Axle: inköp, saldo, inventering och beställningar, med verktyg för däck som storlek, säsong, ålder från DOT-koden och etiketter.',
		photo: `${IMG}/photos/lager.jpg`,
		pos: 'center 35%',
		image: {
			src: `${IMG}/app-lagerov.jpg`,
			alt: 'Översikten för lagret med däck per fälgstorlek, märken och lagervärde',
		},
		blocks: [
			{
				title: 'Inköp',
				text: 'Registrera inköpet, så uppdateras lagret.',
			},
			{
				title: 'Alltid rätt saldo',
				text: 'Se saldo och lagervärde, och allt som hänt med varje artikel.',
			},
			{
				title: 'Räkna om',
				text: 'Ändra saldot efter en inventering. Kasserade varor tas ut med ett klick.',
			},
			{
				title: 'Beställ det som tar slut',
				text: 'Se vad som ska beställas, och beställ direkt från arbetsordern.',
			},
			{
				title: 'Verktyg för däck',
				text: 'Däck per storlek och säsong, ålder från DOT-koden, en egen däckkatalog och etiketter.',
			},
		],
		faqs: [
			{
				q: 'Kan vi räkna om lagret?',
				a: 'Ja. Ändra saldot, så sparas det som en inventering.',
			},
			{
				q: 'Kan vi skriva ut etiketter för däck?',
				a: 'Ja.',
			},
			{
				q: 'Kan vi beställa däck direkt i Axle?',
				a: 'Inte än.',
			},
		],
		related: ['dackhotell', 'arbetsorder', 'offert'],
	},
	{
		slug: 'arbetsorder',
		name: 'Arbetsorder',
		h1: 'Arbetsorder för hela verkstaden',
		lead: 'Jobb och delar på samma order. När den är klar fakturerar ni direkt.',
		seoTitle: 'Arbetsorder för verkstäder | Catso Axle',
		seoDescription:
			'Arbetsorder i Catso Axle: jobb och delar på samma order, varning när del saknas, planering mot kalendern, verkstadsskärm och faktura när ordern är klar.',
		photo: `${IMG}/photos/arbetsorder.jpg`,
		pos: 'center 40%',
		blocks: [
			{
				title: 'Jobb och delar',
				text: 'Allt som ska göras och vilka delar som behövs, på en order.',
			},
			{
				title: 'Del saknas?',
				text: 'Ni ser direkt om en del inte finns i lager, och kan beställa den med ett klick.',
			},
			{
				title: 'Planera mot kalendern',
				text: 'Se mekaniker och lyft, och om något krockar.',
			},
			{
				title: 'Skärm i verkstaden',
				text: 'En stor skärm i hallen visar dagens order.',
			},
			{
				title: 'Fakturera direkt',
				text: 'En klar order blir en faktura eller ett kvitto.',
			},
		],
		faqs: [
			{
				q: 'Kan flera order faktureras på en faktura?',
				a: 'Ja, för samma kund.',
			},
			{
				q: 'Vad får mekanikern?',
				a: 'Ett utskrivet arbetsblad.',
			},
			{
				q: 'Går en klar order att öppna igen?',
				a: 'Ja, tills den är fakturerad.',
			},
			{
				q: 'Ser vi vad en order gav i vinst?',
				a: 'Ja. Ägaren ser en efterkalkyl.',
			},
		],
		related: ['tidsbokning', 'offert', 'lager'],
	},
];

export const MODUL_SLUGS = MODULER.map((m) => m.slug);

export const modulBySlug = (slug: string): Modul | undefined => MODULER.find((m) => m.slug === slug);

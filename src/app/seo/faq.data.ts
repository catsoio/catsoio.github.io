export interface Faq {
	q: string;
	a: string;
}

/** Samma frågor visas på sidan och i FAQPage-schemat, så de kan inte glida isär. */
export const faqJsonLd = (faqs: Faq[]) => ({
	'@type': 'FAQPage',
	mainEntity: faqs.map((f) => ({
		'@type': 'Question',
		name: f.q,
		acceptedAnswer: { '@type': 'Answer', text: f.a },
	})),
});

export const HOME_FAQ: Faq[] = [
	{
		q: 'Vad är Catso AI & Robotics?',
		a: 'Vi bygger verkstadssystem, AI-agenter, appar för e-handel och robotik för svenska företag och myndigheter. Catso Axle är systemet för däck- och bilverkstäder, VERA-01 är vår AI-agent för advokatbyråer och Catso AI Sök är vår Shopify-app.',
	},
	{
		q: 'Vad är Catso Axle?',
		a: 'Ett verkstadssystem för däckfirmor och bilverkstäder. Lager, däckhotell, bokningar, arbetsorder och fakturor ligger på ett ställe och körs i webbläsaren, så det finns inget att installera.',
	},
	{
		q: 'Vad är VERA-01?',
		a: 'En AI-agent byggd för svenska advokatbyråer. Den körs lokalt hos er, analyserar ärenden, tar fram utkast och söker i svenska rättskällor. Ingen data skickas till externa tjänster.',
	},
	{
		q: 'Bygger ni appar för Shopify?',
		a: 'Ja, vi är officiell Shopify-partner. Catso AI Sök är vår första app: en sökruta som tolkar vad kunden menar och visar produkter som finns i lager. Den installeras direkt i butiken utan ändringar i temat.',
	},
	{
		q: 'Vad kostar det?',
		a: 'Det beror på produkt, verksamhet och volym. Mejla oss på support@catso.io så berättar vi vad det blir för er.',
	},
];

export const AXLE_FAQ: Faq[] = [
	{
		q: 'Vad är Catso Axle?',
		a: 'Ett verkstadssystem för däckfirmor och bilverkstäder: tidsbokning, däckhotell, lager, offerter, arbetsorder och försäljning. Det körs i webbläsaren.',
	},
	{
		q: 'Funkar det som däckhotell?',
		a: 'Ja. Varje set läggs in med regnummer, hyllplats och avgift. Du ser vilka som inte har betalat och vilka som skulle ha hämtats, och du kan skicka SMS till kunderna inför bytet.',
	},
	{
		q: 'Hur blir en bokning en arbetsorder?',
		a: 'Du öppnar bokningen när kunden kommer och skapar en arbetsorder. Kund, bil och vad som ska göras följer med.',
	},
	{
		q: 'Hur godkänner kunden en offert?',
		a: 'Du skickar offerten som SMS eller mejl. Kunden öppnar länken i mobilen och trycker Godkänn eller Avböj. Du ser svaret på offerten direkt.',
	},
	{
		q: 'Kan jag skicka SMS till kunderna i däckhotellet?',
		a: 'Ja. Du väljer vilka som ska få det, skriver texten en gång, och namn och regnummer fylls i för varje kund.',
	},
	{
		q: 'Vad ser mekanikerna?',
		a: 'Mekanikern får ett utskrivet arbetsblad med regnummer, vad som ska göras och plats för anteckningar. Inga priser.',
	},
	{
		q: 'Behöver jag installera något?',
		a: 'Nej. Det körs i webbläsaren på dator, surfplatta och mobil.',
	},
	{
		q: 'Vad kostar det?',
		a: 'Skriv till oss i formuläret eller mejla support@catso.io.',
	},
];

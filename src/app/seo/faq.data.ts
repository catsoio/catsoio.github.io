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
		a: 'Vi bygger AI-agenter och robotik för svenska företag och myndigheter. Vår första AI-agent är VERA-01 för advokatbyråer, och vi har Catso AI Sök, en AI-sökning för Shopify-butiker. Inom robotik bygger vi styrningen för autonoma robotflottor.',
	},
	{
		q: 'Vad är VERA-01?',
		a: 'En AI-agent byggd för svenska advokatbyråer. Den körs lokalt hos er, analyserar ärenden, tar fram utkast och söker i svenska rättskällor. Ingen data skickas till externa tjänster.',
	},
	{
		q: 'Vad gör ni inom robotik?',
		a: 'Vi bygger styrningen för autonoma robotflottor. Projektet börjar med en digital tvilling av er anläggning, där robotarna testas och valideras i simulering innan de körs på riktigt. Sedan driftsätter vi i verkligheten.',
	},
	{
		q: 'Vart tar vår data vägen?',
		a: 'Våra AI-agenter körs on-prem eller i en svensk molnregion, så er data stannar i er miljö. Vi är byggda i Sverige och hanterar data inom EU.',
	},
	{
		q: 'Bygger ni appar för Shopify?',
		a: 'Ja, vi är officiell Shopify-partner. Catso AI Sök är en sökruta som tolkar vad kunden menar och visar produkter som finns i lager. Den installeras direkt i butiken utan ändringar i temat.',
	},
	{
		q: 'Bygger ni något annat än AI och robotik?',
		a: 'Ja. Vi har också verkstadssystemet Catso Axle för däckfirmor och bilverkstäder, och apparna Hemmafest och Poängjakten. De är egna produkter som vi driftar själva.',
	},
	{
		q: 'Vad kostar det?',
		a: 'Det beror på produkt, verksamhet och volym. Mejla oss på support@catso.io så berättar vi vad det blir för er.',
	},
];

export const AXLE_FAQ: Faq[] = [
	{
		q: 'Vad är Catso Axle?',
		a: 'Ett verkstadssystem för däckfirmor och bilverkstäder: tidsbokning, däckhotell, lager, offerter, arbetsorder och försäljning.',
	},
	{
		q: 'Funkar det som däckhotell?',
		a: 'Ja. Varje set läggs in med regnummer, hyllplats och avgift. Du ser vilka som inte har betalat och vilka som skulle ha hämtats, och du kan skicka SMS till kunderna inför bytet.',
	},
	{
		q: 'Hur blir en bokning en arbetsorder?',
		a: 'Du kan skapa arbetsordern direkt när du sparar bokningen, eller öppna bokningen när kunden kommer.',
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
		a: 'Ett utskrivet arbetsblad med regnummer, vad som ska göras och plats för anteckningar.',
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

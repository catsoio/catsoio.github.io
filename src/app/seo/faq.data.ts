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
		q: 'Kan vi testa innan vi bestämmer oss?',
		a: 'Ja. Ni testar gratis i 2 månader, utan bindningstid, avtal eller kreditkort.',
	},
	{
		q: 'Behöver vi installera något?',
		a: 'Nej. Axle körs i webbläsaren på dator, surfplatta och mobil.',
	},
	{
		q: 'Kan vi skicka SMS till kunderna i däckhotellet?',
		a: 'Ja. Ni väljer mottagare och skriver texten en gång. Namn och registreringsnummer fylls i för varje kund.',
	},
	{
		q: 'Vad kostar det?',
		a: 'Ring 070-330 09 87 eller mejla support@catso.io, så går vi igenom vad som passar er verkstad.',
	},
];

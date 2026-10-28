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
		a: 'Vi bygger verkstadssystem, AI-agenter, appar för e-handel och robotik för svenska företag och myndigheter. Catso Verkstad är systemet för däck- och bilverkstäder, VERA-01 är vår AI-agent för advokatbyråer och Catso AI Sök är vår Shopify-app.',
	},
	{
		q: 'Vad är Catso Verkstad?',
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

export const VERKSTAD_FAQ: Faq[] = [
	{
		q: 'Vad är Catso Verkstad?',
		a: 'Ett verkstadssystem för däckfirmor och bilverkstäder. Kunder och bilar, lager, däckhotell, bokningar, arbetsorder och fakturor hänger ihop i ett system som du kör i webbläsaren.',
	},
	{
		q: 'Funkar det som däckhotell?',
		a: 'Ja. Varje hjulset läggs in med regnummer, hyllplats och avgift. Du ser vilka som är betalda, vilka som inte är det och vilka som skulle ha hämtats för länge sedan, och när kunden ringer söker du fram setet på några sekunder.',
	},
	{
		q: 'Hur blir en bokning en arbetsorder?',
		a: 'Du klickar på bokningen när kunden kommer. Då skapas en arbetsorder med kund och bil ifyllda, och delarna tas ur lagret när ordern är klar.',
	},
	{
		q: 'Kan jag skriva ut faktura och kvitto?',
		a: 'Ja. En faktura får förfallodatum och betalningsuppgifter, ett kvitto är betalt direkt. Båda får rätt moms och löpande nummer, och i fakturalistan ser du vad som är obetalt eller förfallet.',
	},
	{
		q: 'Vad ser mekanikerna?',
		a: 'Mekanikern öppnar arbetsordern i mobilen och ser bara sina egna bilar, utan priser och kunduppgifter. Raderna bockas av när de är gjorda.',
	},
	{
		q: 'Behöver jag installera något?',
		a: 'Nej. Catso Verkstad körs i webbläsaren på dator, surfplatta och mobil, så det finns inget att installera eller uppdatera.',
	},
	{
		q: 'Kan jag testa innan jag bestämmer mig?',
		a: 'Ja. Vi sätter upp en testmiljö åt dig, helst med några av dina egna artiklar och kunder i. Det kostar inget och du förbinder dig inte till något.',
	},
	{
		q: 'Vad kostar Catso Verkstad?',
		a: 'Hör av dig via formuläret på sidan eller mejla support@catso.io, så berättar vi vad det kostar för er verkstad.',
	},
];

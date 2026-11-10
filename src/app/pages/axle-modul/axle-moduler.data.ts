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
	image?: ModulImage;
	/** Detta ingår: tre till sex block. */
	blocks: ModulBlock[];
	/** Funktioner i korthet. */
	points: string[];
	faqs: Faq[];
	/** Slug på de moduler som länkas under "Mer i Axle". */
	related: string[];
}

const IMG = '/assets/imgs/axle';

export const MODULER: Modul[] = [
	{
		slug: 'dackhotell',
		name: 'Däckhotell',
		h1: 'Däckhotell: varje set från hylla till hämtning',
		lead: 'Varje set läggs in med regnummer, hylla och avgift. Ni ser vilka som ska hämtas, vilka som inte betalat och vilka kunder som har under 4 mm mönster kvar.',
		seoTitle: 'Däckhotell för verkstäder | Catso Axle',
		seoDescription:
			'Däckhotell i Catso Axle: set med regnummer och hylla, etikett, hämtningar per vecka, SMS-inkallning och en lista över kunder med slitna däck att ringa.',
		image: {
			src: `${IMG}/app-hotellov.jpg`,
			alt: 'Översikten för däckhotellet med hämtningar per vecka, hyllor och mönsterdjup',
		},
		blocks: [
			{
				title: 'Inlämning',
				text: 'Setet läggs in med regnummer, vad som lämnats in, säsong, skick och avgift. Säsong, avgift och hämtdatum föreslås från era förval, och däckdimensionen hämtas från bilen.',
			},
			{
				title: 'Hyllor och etikett',
				text: 'Lager och hyllor läggs upp en gång. Varje set får en plats som "Däckhotellet · Hylla H-12", och etiketten skrivs ut med DH-nummer, regnummer, kund, plats och ruta för anmärkning om skador. Tre etiketter per A4-ark.',
			},
			{
				title: 'Översikt',
				text: 'Hämtningar vecka för vecka, en karta över hyllorna, de vanligaste storlekarna och de set som skulle ha hämtats. Mönsterdjupet visas som en lista över däck under 4 mm, så ni vet vem ni ska ringa om nya däck.',
			},
			{
				title: 'Kalla in med SMS',
				text: 'Skriv texten en gång och välj vilka som ska få den. Namn och regnummer fylls i för varje kund, och en kund med flera bilar får ett SMS. De som fått ett SMS de senaste 30 dagarna är inte förvalda. Inget skickas automatiskt.',
			},
			{
				title: 'Avgifter',
				text: 'Avgiften gäller per år och setet markeras som betalt när kunden betalat. Kunden kan få sina set på ett säljkort, ett per inlämning, och rabatten läggs på kortet.',
			},
		],
		points: [
			'Lager och hyllplatser i lagerregistret',
			'Etikett för varje set',
			'Hämtas per vecka',
			'Försenade set med ring-knapp',
			'Däck under 4 mm mönster',
			'Obetalda avgifter',
			'Förval för säsong, avgift och plats',
			'Sök på regnummer, kund, telefon eller hylla',
		],
		faqs: [
			{
				q: 'Hur ser jag vilka som ska hämtas?',
				a: 'Översikten visar hämtningar per vecka, och de som är försenade ligger för sig med en knapp för att ringa kunden.',
			},
			{
				q: 'Skickas inkallningen automatiskt?',
				a: 'Nej. Ni väljer mottagare och bekräftar innan något skickas. Det som går iväg räknas mot SMS-kvoten i paketet.',
			},
			{
				q: 'Hur många hjul kan ett set ha?',
				a: 'Fyra är förvalt, och antalet ändras under fler uppgifter om kunden bara lämnar in ett par. Förvalet kan ni ändra i inställningarna.',
			},
			{
				q: 'Kan kunden betala för förvaringen på en faktura?',
				a: 'Ja. Setet läggs på ett säljkort och blir faktura eller kvitto som vilken försäljning som helst.',
			},
		],
		related: ['tidsbokning', 'lager', 'offert'],
	},
	{
		slug: 'tidsbokning',
		name: 'Tidsbokning',
		h1: 'Tidsbokning med en kolumn per mekaniker och lyft',
		lead: 'Dagen visas som en kolumn per mekaniker och lyft. Klicka på en ledig tid och boka. Bokningen och arbetsordern hör ihop, så ändrar ni tiden på det ena följer det andra med.',
		seoTitle: 'Tidsbokning för verkstäder | Catso Axle',
		seoDescription:
			'Tidsbokning i Catso Axle: en kolumn per mekaniker och lyft, bokningar som blir arbetsorder och en bokningssida där kunden ser pris för sin bil.',
		image: {
			src: `${IMG}/app-resurser.jpg`,
			alt: 'Tidsbokningen med en kolumn per mekaniker och lyft',
		},
		blocks: [
			{
				title: 'Dagen på ett ställe',
				text: 'Varje mekaniker, lyft och plats har en kolumn med antal jobb överst. Lyftets kolumn visar samma bokning streckad, och jobb utan mekaniker ligger under Ej tilldelad. Dag, vecka, månad och lista byts på plats utan att ni tappar dag eller filter.',
			},
			{
				title: 'Ny kund över telefon',
				text: 'Skriv telefonnumret först. Finns kunden väljer ni kunden i listan, och är numret nytt räcker det: kunden skapas med numret och namnet fyller ni i senare på kundkortet.',
			},
			{
				title: 'Att planera',
				text: 'Till höger om kalendern ligger förfrågningar från bokningssidan och öppna arbetsorder som inte har någon tid. Dra en order till en mekaniker och en tid, så öppnas bokningen med allt ifyllt.',
			},
			{
				title: 'Bokning och arbetsorder',
				text: 'En ny bokning skapar en arbetsorder när ni sparar, eller så kopplar ni en order som redan finns. Start och slut har datum och klockslag var för sig, så ett jobb kan gå över flera dagar. Ordernumret och en varning för saknad del syns på bokningen.',
			},
			{
				title: 'Bokningssida på verkstadens webbplats',
				text: 'Kunden skriver regnumret, ser sin bil och vad varje åtgärd kostar för just den, och väljer dag och förmiddag eller eftermiddag. Det blir en förfrågan i kalendern som ni bekräftar. Kunden får ett SMS, och bilen och kunden skapas i registret först när ni bekräftat.',
			},
		],
		points: [
			'Resursvy per mekaniker, lyft och plats',
			'Dra och släpp samt ändra längd i vecka- och månadsvyn',
			'Färg per mekaniker och status',
			'Förfrågningar från bokningssidan',
			'Bokning som blir arbetsorder',
			'Flerdagsjobb',
			'Telefonnummer som sökning',
			'Pris per åtgärd efter bilens klass och fälgstorlek',
		],
		faqs: [
			{
				q: 'Kan kunden boka en exakt tid själv?',
				a: 'Nej. Kunden väljer dag och förmiddag eller eftermiddag och skickar en förfrågan som ni bekräftar. Direktbokning av lediga tider finns inte.',
			},
			{
				q: 'Behöver verkstaden en webbplats för bokningssidan?',
				a: 'Ja. Bokningssidan visas på verkstadens webbplats, och vi sätter upp den och slår på den åt er. Kontakta oss så berättar vi hur.',
			},
			{
				q: 'Hur räknas priset som kunden ser?',
				a: 'Servern räknar priset för kundens bil efter bilens klass och största fälg, med de prisrader och kampanjer ni lagt in på åtgärden. Det lovade priset följer med till arbetsordern.',
			},
			{
				q: 'Kan ett jobb gå över flera dagar?',
				a: 'Ja. Start och slut har datum och klockslag var för sig, och dagsvyn fyller kolumnen för de dagar som ligger mitt i jobbet.',
			},
		],
		related: ['arbetsorder', 'dackhotell', 'offert'],
	},
	{
		slug: 'offert',
		name: 'Offert',
		h1: 'Offert som kunden godkänner i mobilen',
		lead: 'Skicka kostnadsförslaget som SMS eller mejl. Kunden öppnar länken, ser vad som ingår och trycker Godkänn eller Avböj. Ni ser när länken öppnades och vad kunden svarade.',
		seoTitle: 'Offert som kunden godkänner | Catso Axle',
		seoDescription:
			'Offert i Catso Axle: kostnadsförslag som SMS eller mejl, kunden godkänner med en länk i mobilen och en godkänd offert blir en arbetsorder.',
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
				title: 'Skicka',
				text: 'Välj SMS, mejl eller båda. Texten är redigerbar med en förhandsvisning, och länken läggs till om ni glömt den. Varje utskick sparas på offerten, och faller en kanal går den andra ändå.',
			},
			{
				title: 'Kundens sida',
				text: 'Länken öppnas i mobilen utan inloggning och visar den version ni lämnade, utan interna uppgifter. Jobb med fast pris visas utan radpriser. Första gången kunden öppnar den sparas tiden.',
			},
			{
				title: 'Giltighet och slutpris',
				text: 'Offerten gäller ett antal dagar som ni bestämmer i inställningarna. Ni anger också hur många procent slutpriset får avvika. Blir det dyrare än så markeras arbetsordern, så ni ser det innan fakturan.',
			},
			{
				title: 'Från offert till arbetsorder',
				text: 'En godkänd offert blir en arbetsorder med jobb och rader. Ändrar ni en lämnad offert blir den ett utkast igen och den gamla länken slutar gälla, så att en gammal länk aldrig visar en annan version än den kunden svarade på.',
			},
			{
				title: 'Svaret',
				text: 'Kundens svar sparas med datum och syns i aktivitetsloggen. Verkstaden får ett mejl. Bara det första svaret gäller, och ägaren kan ångra det.',
			},
		],
		points: [
			'SMS och mejl med egen text',
			'Länk som fungerar i mobilen',
			'Syns när kunden öppnat',
			'Giltighet och tillåten avvikelse',
			'Blir arbetsorder',
			'Egen nummerserie, KF',
			'Offert på kund- och bilkortet',
			'Sök på KF-nummer',
		],
		faqs: [
			{
				q: 'Måste kunden ha ett konto?',
				a: 'Nej. Kunden öppnar länken från SMS eller mejl och svarar direkt på sidan.',
			},
			{
				q: 'Vad händer när giltigheten har gått ut?',
				a: 'Offerten visas som utgången och tar inte emot något svar. Ni kan lämna den igen.',
			},
			{
				q: 'Kan jag skicka en offert för ett litet jobb?',
				a: 'Det går, men det krävs inte. För ett enkelt jobb räcker en arbetsorder och ett säljkort.',
			},
			{
				q: 'Hur fungerar SMS-utskicket?',
				a: 'SMS räknas mot kvoten i paketet. Mejlet går från vår brevlåda med verkstadens adress som svarsadress, så kundens svar landar hos er.',
			},
		],
		related: ['arbetsorder', 'tidsbokning', 'lager'],
	},
	{
		slug: 'lager',
		name: 'Lager',
		h1: 'Lager för däck och delar',
		lead: 'Däck per fälgstorlek och säsong, märken, lagervärde och vad som ska beställas. Däckens ålder räknas fram från DOT-koden, så ni ser vilka som borde säljas först.',
		seoTitle: 'Lager för däck och delar | Catso Axle',
		seoDescription:
			'Lager i Catso Axle: däck per fälgstorlek och säsong, ålder från DOT-koden, inköp med ingående moms, sök hos Gummigrossen och etiketter för däck.',
		image: {
			src: `${IMG}/app-lagerov.jpg`,
			alt: 'Översikten för lagret med däck per fälgstorlek, märken och lagervärde',
		},
		blocks: [
			{
				title: 'Artiklar med rätt fält',
				text: 'En artikeltyp bestämmer vilka fält kortet frågar efter. Ett däck frågar efter dimension, märke, mönster och säsong, en fälg efter bultar och ET, och en del efter benämning och artikelnummer. Hylla och plats väljs ur lagerregistret.',
			},
			{
				title: 'Översikt',
				text: 'Däck per fälgstorlek och säsong, märken (klicka för att öppna listan), lagervärde över tid och vad som ska beställas med en mätare för varje artikel. Ålder från DOT-koden visas när någon artikel har kod.',
			},
			{
				title: 'Delar till ett jobb',
				text: 'En dragkrok som köps in till ett jobb är inte lager. Markera artikeln som enstaka del så får den ingen påminnelsenivå och räknas aldrig som slut.',
			},
			{
				title: 'Inköp',
				text: 'Ett inköp är ett kort med leverantör, rader och en länk till var ni köpte. Priset skrivs inklusive moms och lagras exklusive, så lagervärde och marginal är rätt. Saknas en del på en arbetsorder öppnar knappen Beställ ett inköp med delen ifylld.',
			},
			{
				title: 'Gummigrossen',
				text: 'Anslut ert eget kundkonto så kan ni söka däck i deras sortiment direkt när ni lägger upp en artikel. Träffen fyller i märke, mönster, mått, säsong, EAN och pris. Det går inte att beställa från Axle, bara att söka och hämta uppgifter och tidigare beställningar.',
			},
		],
		points: [
			'Artikeltyper för däck, fälgar och delar',
			'Lager och hyllplatser',
			'Saldo och påminnelsenivå',
			'Lagervärde över tid',
			'Ålder från DOT-koden',
			'Utskrift av däcketiketter eller lista',
			'Inköpskort med ingående moms',
			'Sök på dimension, märke eller artikelnummer',
		],
		faqs: [
			{
				q: 'Kan vi beställa hos Gummigrossen från Axle?',
				a: 'Nej, inte än. Ni kan söka, hämta artikeluppgifter och läsa in en tidigare beställning som ett inköpsutkast.',
			},
			{
				q: 'Vad är skillnaden mellan lagerförd och enstaka del?',
				a: 'Lagerförda artiklar har en påminnelsenivå och räknas som slut. En enstaka del köps in till ett jobb och försvinner ur listan när saldot är noll.',
			},
			{
				q: 'Hur vet jag att en del saknas på en order?',
				a: 'Det avgörs av saldot. Begär ordern mer än det som finns, minus det som redan är lovat till andra order, blir raden gul med en knapp för att beställa.',
			},
			{
				q: 'Kan vi skriva ut etiketter för däck?',
				a: 'Ja. Välj artiklar i listan och skriv ut etiketter, tolv per A4-ark, eller en lista över däck i lager.',
			},
		],
		related: ['dackhotell', 'arbetsorder', 'offert'],
	},
	{
		slug: 'arbetsorder',
		name: 'Arbetsorder',
		h1: 'Arbetsorder med jobb, delar och arbetsblad',
		lead: 'Ett jobb är en rad med vad som ska göras och ett pris, och delarna ligger under. När ordern är klar blir den ett säljkort med faktura eller kvitto.',
		seoTitle: 'Arbetsorder för verkstäder | Catso Axle',
		seoDescription:
			'Arbetsorder i Catso Axle: jobb och delar på samma order, varning när del saknas, planering mot kalendern, verkstadsskärm och faktura när ordern är klar.',
		blocks: [
			{
				title: 'Jobb och delar',
				text: 'Varje jobb har en text, ett pris och en rabatt, och delarna läggs under med artikelsök, antal och pris. Jobbet kan markeras Klar, Del saknas eller Debiteras ej. En order som skapas från en offert eller en bokning kommer med sina rader.',
			},
			{
				title: 'Del saknas',
				text: 'Ordern jämför mot lagersaldot och mot det som redan är lovat till andra order. Räcker det inte blir raden gul med en knapp som öppnar ett inköp med delen och antalet ifyllt. Kommer varan in försvinner varningen av sig själv.',
			},
			{
				title: 'Tid och plats',
				text: 'Start, slut, mekaniker och lyft sätts på ordern. Under dem visas dagen i miniatyr med bokningarna, och ordens tid ligger som en ruta. Är mekanikern eller lyftet redan upptaget blir rutan röd och säger vilka bokningar som krockar.',
			},
			{
				title: 'Sparas av sig själv',
				text: 'En befintlig order sparas 1,5 sekunder efter sista ändringen. Ni ser om den är sparad eller har osparade ändringar, och statusbyten sparas direkt.',
			},
			{
				title: 'Verkstadsskärm',
				text: 'En stor skärm i hallen visar öppna order med regnummer, bil, mekaniker, plats och vad som ska göras. Den uppdateras direkt och har ingen inloggning. Ägaren slår på den och skriver in en hemlig adress en gång i skärmens webbläsare. Kundens namn och priser visas aldrig där.',
			},
			{
				title: 'Klar och fakturerad',
				text: 'När ordern blir klar tas delarna ur lagret. Ett säljkort skapas från den, och en kund med samlingsfaktura får en följesedel med bilen och faktureras en gång i månaden. Är ordern fakturerad är den låst.',
			},
		],
		points: [
			'Jobb med delar under',
			'Rabatt per rad',
			'Mätarställning och referenser',
			'Planering mot kalendern',
			'Arbetsblad att skriva ut',
			'Verkstadsskärm',
			'Följesedel',
			'Flera order på en samlingsfaktura',
		],
		faqs: [
			{
				q: 'Kan flera order faktureras på ett kort?',
				a: 'Ja, för samma kund. Orderna ligger under varsin rubrik med datum, referens och summa, vilket är vad en samlingsfaktura ska visa.',
			},
			{
				q: 'Vad ser mekanikern?',
				a: 'Ett utskrivet arbetsblad med regnummer, vad som ska göras och plats för anteckningar.',
			},
			{
				q: 'Ingår verkstadsskärmen?',
				a: 'En skärm ingår i paketet Verkstad. Ägaren slår på den i inställningarna och väljer bland fyra utseenden. Skärmen visar alla öppna order i verkstaden.',
			},
			{
				q: 'Går en klar order att öppna igen?',
				a: 'Ja, tills den är fakturerad. Delar som redan tagits ur lagret läggs inte tillbaka automatiskt.',
			},
		],
		related: ['tidsbokning', 'offert', 'lager'],
	},
];

export const MODUL_SLUGS = MODULER.map((m) => m.slug);

export const modulBySlug = (slug: string): Modul | undefined => MODULER.find((m) => m.slug === slug);

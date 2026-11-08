/** Sidans riktiga struktur. Header, footer och produktöversikten läser alla härifrån. */
export interface Product {
	name: string;
	path: string;
	/** Vem den är till för, en rad. */
	audience: string;
	text: string;
}

export const PRODUCTS: Product[] = [
	{
		name: 'Catso Axle',
		path: '/apps/axle',
		audience: 'Däckfirmor och bilverkstäder',
		text: 'Verkstadssystem med lager, däckhotell, bokningar, arbetsorder, offert, fakturor och kvitton på ett ställe.',
	},
	{
		name: 'VERA-01',
		path: '/vera-01',
		audience: 'Advokatbyråer',
		text: 'AI-agent byggd för svenska advokatbyråer. Analyserar ärenden, tar fram utkast och söker i rättskällor. Körs lokalt hos er.',
	},
	{
		name: 'Catso AI Sök',
		path: '/shopify/apps/ai-search',
		audience: 'Shopify-butiker',
		text: 'En sökruta som tolkar vad kunden menar och visar produkter som finns i lager, plus en shoppingassistent. Svenska och engelska.',
	},
	{
		name: 'Hemmafest',
		path: '/hemmafest',
		audience: 'Alla som festar',
		text: 'Appen för att skapa och hitta fester: ange festnamn och datum, bjud in vänner.',
	},
	{
		name: 'Poängjakten',
		path: '/poangjakten/sponsor',
		audience: 'Varumärken som vill nå gymnasieelever',
		text: 'Gymnasieelever tävlar om att skapa innehåll åt ert varumärke. Bli partner och nå Sveriges studenter.',
	},
];

export const COMPANY_LINKS = [
	{ label: 'Om oss', path: '/om-oss' },
	{ label: 'Kontakt', path: '/kontakt' },
	{ label: 'Integritetspolicy', path: '/integritet' },
];

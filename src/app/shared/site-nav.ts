/** Sidans riktiga struktur. Header, footer och produktöversikten läser alla härifrån. */
export interface Product {
	name: string;
	path: string;
	/** Vem den är till för, en rad. */
	audience: string;
	text: string;
	/** AI-produkterna är det Catso är. De andra är system och appar vi också bygger. */
	group: 'ai' | 'other';
}

export const PRODUCTS: Product[] = [
	{
		name: 'VERA-01',
		path: '/vera-01',
		audience: 'Advokatbyråer',
		group: 'ai',
		text: 'AI-agent byggd för svenska advokatbyråer. Analyserar ärenden, tar fram utkast och söker i rättskällor. Körs lokalt hos er.',
	},
	{
		name: 'Catso AI Sök',
		path: '/shopify/apps/ai-search',
		audience: 'Shopify-butiker',
		group: 'ai',
		text: 'AI-sök som tolkar vad kunden menar och visar produkter som finns i lager, plus en shoppingassistent. Svenska och engelska.',
	},
	{
		name: 'Catso Axle',
		path: '/apps/axle',
		audience: 'Däckfirmor och bilverkstäder',
		group: 'other',
		text: 'Verkstadssystem med lager, däckhotell, bokningar, arbetsorder, offert, fakturor och kvitton på ett ställe.',
	},
	{
		name: 'Hemmafest',
		path: '/hemmafest',
		audience: 'Alla som festar',
		group: 'other',
		text: 'Appen för att skapa och hitta fester: ange festnamn och datum, bjud in vänner.',
	},
	{
		name: 'Poängjakten',
		path: '/poangjakten/sponsor',
		audience: 'Varumärken som vill nå gymnasieelever',
		group: 'other',
		text: 'Gymnasieelever tävlar om att skapa innehåll åt ert varumärke. Bli partner och nå Sveriges studenter.',
	},
];

export const COMPANY_LINKS = [
	{ label: 'Om oss', path: '/om-oss' },
	{ label: 'Kontakt', path: '/kontakt' },
	{ label: 'Integritetspolicy', path: '/integritet' },
];

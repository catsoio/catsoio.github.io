import { RouteSEO } from './seo.types';
import { HOME_FAQ, VERKSTAD_FAQ, faqJsonLd } from './faq.data';

const ORIGIN = 'https://catso.io';

const breadcrumbs = (...items: [name: string, path: string][]) => ({
	'@type': 'BreadcrumbList',
	itemListElement: items.map(([name, path], i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name,
		item: `${ORIGIN}${path}`,
	})),
});

/** Startsidan nås på både / och /home. Båda pekar canonical till /. */
export const HOME_SEO: RouteSEO = {
	title: 'Catso AI & Robotics | Verkstadssystem, AI-agent och Shopify-appar',
	description:
		'Catso bygger Catso Verkstad för däck- och bilverkstäder, VERA-01 för advokatbyråer, AI-sök för Shopify och robotik för industrin. Byggt i Sverige.',
	canonical: `${ORIGIN}/`,
	og: { type: 'website', image: `${ORIGIN}/assets/og/catso-og.png` },
	twitter: { card: 'summary_large_image', image: `${ORIGIN}/assets/og/catso-og.png` },
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${ORIGIN}/#website`,
				name: 'Catso AI & Robotics',
				url: `${ORIGIN}/`,
				inLanguage: 'sv-SE',
				publisher: { '@id': `${ORIGIN}/#organization` },
			},
			{
				'@type': 'ItemList',
				name: 'Catso produkter',
				itemListElement: [
					['Catso Verkstad: verkstadssystem för däck- och bilverkstäder', '/apps/verkstad'],
					['VERA-01: lokal AI-agent för advokatbyråer', '/vera-01'],
					['Catso AI Sök: AI-sök och shoppingassistent för Shopify', '/shopify/apps/ai-search'],
					['Hemmafest: skapa och hitta fester', '/hemmafest'],
					['Poängjakten: nå Sveriges gymnasieelever', '/poangjakten/sponsor'],
				].map(([name, path], i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name,
					url: `${ORIGIN}${path}`,
				})),
			},
			faqJsonLd(HOME_FAQ),
		],
	},
};

// seo/hemmafest.seo.ts
export const HEMMAFEST_SEO: RouteSEO = {
	title: 'Hemmafest — Skapa och hitta fester | Catso',
	description: 'Hitta och skapa fester snabbt och enkelt med Hemmafest från Catso. Ange festnamn, datum, bjud in vänner — klart.',
	og: { type: 'product', image: '/assets/imgs/hemmafestbanner.png' },
	twitter: {
		card: 'summary_large_image',
		image: '/assets/imgs/hemmafestbanner.png',
	},
	jsonLd: {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Hemmafest',
		applicationCategory: 'LifestyleApplication',
		operatingSystem: 'Web, iOS, Android',
		url: 'https://catso.io/hemmafest',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
	},
};

export const HEMMAFEST_BUSINESS_SEO: RouteSEO = {
	title: 'Annonsera i Hemmafest | Nå unga festsugna | Catso',
	description:
		'Annonsera i Hemmafest och synas direkt i flödet. Banner eller helt kort, paket från 2 000 kr/mån. Hör av dig så kör vi.',
	og: { type: 'website', image: '/assets/imgs/hemmafestbanner.png' },
	twitter: {
		card: 'summary_large_image',
		image: '/assets/imgs/hemmafestbanner.png',
	},
	jsonLd: {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Annonsera i Hemmafest',
		url: 'https://catso.io/hemmafest/business',
	},
};

export const HEMMAFEST_PRIVACY_SEO: RouteSEO = {
	title: 'Integritetspolicy för Hemmafest | Catso',
	description: 'Så hanterar Hemmafest dina personuppgifter.',
	robots: 'index,follow',
};

export const HEMMAFEST_TERMS_SEO: RouteSEO = {
	title: 'Användarvillkor för Hemmafest | Catso',
	description: 'Villkoren för att använda Hemmafest.',
	robots: 'index,follow',
};

export const HEMMAFEST_DELETE_SEO: RouteSEO = {
	title: 'Radera ditt Hemmafest-konto | Catso',
	description: 'Begär att ditt Hemmafest-konto och dina uppgifter raderas.',
	robots: 'noindex,follow',
};

export const POANGJAKTEN_SEO: RouteSEO = {
	title: 'Poängjakten — Tävla och nå studenter | Catso',
	description:
		'Poängjakten från Catso: gymnasieelever tävlar om att skapa innehåll åt ert varumärke. Bli partner och nå Sveriges studenter.',
	og: {
		type: 'website',
		image: 'https://catso.io/assets/og/catso-og.png',
	},
	twitter: {
		card: 'summary_large_image',
		image: 'https://catso.io/assets/og/catso-og.png',
	},
	jsonLd: {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Poängjakten',
		applicationCategory: 'SocialNetworkingApplication',
		operatingSystem: 'Web, iOS, Android',
		url: 'https://catso.io/poangjakten',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
	},
};

/** Genomgång av hur systemet hänger ihop, att visa för en kund. Inte för sökmotorer. */
export const KOM_IGANG_SEO: RouteSEO = {
	title: 'Manual: så börjar ni med Catso Verkstad',
	description:
		'Kort manual med bilder: åtta steg för att komma igång med Catso Verkstad.',
	robots: 'noindex,follow',
};

export const VERKSTAD_INFO_SEO: RouteSEO = {
	title: 'Så hänger verkstaden ihop | Catso Verkstad',
	description:
		'Så hänger kund, bil, bokning, arbetsorder, säljkort, däckhotell, lager och faktura ihop i Catso Verkstad.',
	robots: 'noindex,follow',
};

export const INVENTORY_SEO: RouteSEO = {
	title: 'Verkstadssystem för däckfirmor och bilverkstäder | Catso Verkstad',
	description:
		'Catso Verkstad samlar däckhotell, lager, bokningar, arbetsorder och fakturor i ett system som körs i webbläsaren. Be om en kostnadsfri testmiljö.',
	canonical: `${ORIGIN}/apps/verkstad`,
	og: { type: 'product', image: `${ORIGIN}/assets/og/catso-verkstad-og.jpg` },
	twitter: {
		card: 'summary_large_image',
		image: `${ORIGIN}/assets/og/catso-verkstad-og.jpg`,
	},
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				'@id': `${ORIGIN}/apps/verkstad#app`,
				name: 'Catso Verkstad',
				alternateName: 'Verkstadssystem för däckfirmor och bilverkstäder',
				description:
					'Verkstadssystem med däckhotell, lager, bokningar, arbetsorder, fakturor och kundregister. Körs i webbläsaren på dator, surfplatta och mobil.',
				applicationCategory: 'BusinessApplication',
				operatingSystem: 'Web',
				inLanguage: 'sv-SE',
				url: `${ORIGIN}/apps/verkstad`,
				image: `${ORIGIN}/assets/og/catso-verkstad-og.jpg`,
				screenshot: `${ORIGIN}/assets/imgs/dacklager/desktop-dashboard.webp`,
				featureList: [
					'Däckhotell med regnummer, hyllplats och avgift',
					'Lager med saldo, hyllplats och varning för lågt lager',
					'Bokningskalender per mekaniker',
					'Arbetsorder med mobilvy för mekaniker',
					'Faktura och kvitto med moms och löpande nummer',
					'Kunder, bilar och leverantörer',
				],
				publisher: { '@id': `${ORIGIN}/#organization` },
				// TILLFÄLLIGT BORTTAGET (priser):
				// offers: {
				// 	'@type': 'AggregateOffer',
				// 	lowPrice: '495',
				// 	highPrice: '1295',
				// 	priceCurrency: 'SEK',
				// },
			},
			faqJsonLd(VERKSTAD_FAQ),
			breadcrumbs(['Catso', '/'], ['Catso Verkstad', '/apps/verkstad']),
		],
	},
};

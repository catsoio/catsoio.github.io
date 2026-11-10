import { RouteSEO } from './seo.types';
import { HOME_FAQ, AXLE_FAQ, faqJsonLd } from './faq.data';
import type { Modul } from '../pages/axle-modul/axle-moduler.data';

const ORIGIN = 'https://catso.io';

export const breadcrumbs = (...items: [name: string, path: string][]) => ({
	'@type': 'BreadcrumbList',
	itemListElement: items.map(([name, path], i) => ({
		'@type': 'ListItem',
		position: i + 1,
		name,
		item: `${ORIGIN}${path}`,
	})),
});

const PRODUCT_LIST: [name: string, path: string][] = [
	['VERA-01: lokal AI-agent för advokatbyråer', '/vera-01'],
	['Catso AI Sök: AI-sök och shoppingassistent för Shopify', '/shopify/apps/ai-search'],
	['Catso Axle: verkstadssystem för däck- och bilverkstäder', '/apps/axle'],
	['Hemmafest: skapa och hitta fester', '/hemmafest'],
	['Poängjakten: nå Sveriges gymnasieelever', '/poangjakten/sponsor'],
];

/** Startsidan nås på både / och /home. Båda pekar canonical till /. */
export const HOME_SEO: RouteSEO = {
	title: 'Catso AI & Robotics | AI-agenter och robotik för svensk verksamhet',
	description:
		'Catso AI & Robotics bygger AI-agenter och robotiklösningar för svenska företag och myndigheter: VERA-01 för advokatbyråer, AI-sök för Shopify och robotik för industrin.',
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
				// Googles webbplatsnamn läses härifrån: kortnamnet först, hela namnet som alternativ.
				name: 'Catso',
				alternateName: ['Catso AI & Robotics', 'catso.io'],
				url: `${ORIGIN}/`,
				inLanguage: 'sv-SE',
				publisher: { '@id': `${ORIGIN}/#organization` },
			},
			{
				'@type': 'ItemList',
				name: 'Catso produkter',
				itemListElement: PRODUCT_LIST.map(([name, path], i) => ({
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
		url: 'https://catso.io/poangjakten/sponsor',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
	},
};

/** Genomgång av hur systemet hänger ihop, att visa för en kund. Inte för sökmotorer. */
export const KOM_IGANG_SEO: RouteSEO = {
	title: 'Manual: så börjar ni med Catso Axle',
	description:
		'Kort manual med bilder: åtta steg för att komma igång med Catso Axle.',
	robots: 'noindex,follow',
};

export const AXLE_INFO_SEO: RouteSEO = {
	title: 'Så hänger verkstaden ihop | Catso Axle',
	description:
		'Så hänger kund, bil, bokning, arbetsorder, säljkort, däckhotell, lager och faktura ihop i Catso Axle.',
	robots: 'noindex,follow',
};

/** En sida per del av Axle, /axle/<slug>. Innehållet kommer från pages/axle-modul/axle-moduler.data.ts. */
export const axleModulSeo = (m: Modul): RouteSEO => {
	const path = `/axle/${m.slug}`;
	return {
		title: m.seoTitle,
		description: m.seoDescription,
		canonical: `${ORIGIN}${path}`,
		og: { type: 'website', image: `${ORIGIN}/assets/og/catso-axle-og.jpg` },
		twitter: { card: 'summary_large_image', image: `${ORIGIN}/assets/og/catso-axle-og.jpg` },
		robots: 'index,follow',
		jsonLd: {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebPage',
					'@id': `${ORIGIN}${path}#page`,
					name: m.seoTitle,
					url: `${ORIGIN}${path}`,
					isPartOf: { '@id': `${ORIGIN}/#website` },
					about: { '@id': `${ORIGIN}/apps/axle#app` },
				},
				faqJsonLd(m.faqs),
				breadcrumbs(['Catso', '/'], ['Catso Axle', '/apps/axle'], [m.name, path]),
			],
		},
	};
};

export const AXLE_PRISER_SEO: RouteSEO = {
	title: 'Priser och prisräknare | Catso Axle',
	description: 'Priser för Catso Axle från 795 kr i månaden, och en räknare som visar månadskostnaden för just er verkstad.',
	canonical: `${ORIGIN}/axle/priser`,
	og: { type: 'product', image: `${ORIGIN}/assets/og/catso-axle-og.jpg` },
	twitter: { card: 'summary_large_image', image: `${ORIGIN}/assets/og/catso-axle-og.jpg` },
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${ORIGIN}/axle/priser#page`,
				name: 'Priser för Catso Axle',
				url: `${ORIGIN}/axle/priser`,
				isPartOf: { '@id': `${ORIGIN}/#website` },
				about: { '@id': `${ORIGIN}/apps/axle#app` },
			},
			breadcrumbs(['Catso', '/'], ['Catso Axle', '/apps/axle'], ['Priser', '/axle/priser']),
		],
	},
};

export const AXLE_SEO: RouteSEO = {
	title: 'Verkstadssystem för däckfirmor och bilverkstäder | Catso Axle',
	description:
		'Catso Axle samlar däckhotell, lager, bokningar, arbetsorder och fakturor i ett system som körs i webbläsaren. Be om en kostnadsfri testmiljö.',
	canonical: `${ORIGIN}/apps/axle`,
	og: { type: 'product', image: `${ORIGIN}/assets/og/catso-axle-og.jpg` },
	twitter: {
		card: 'summary_large_image',
		image: `${ORIGIN}/assets/og/catso-axle-og.jpg`,
	},
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				'@id': `${ORIGIN}/apps/axle#app`,
				name: 'Catso Axle',
				alternateName: 'Verkstadssystem för däckfirmor och bilverkstäder',
				description:
					'Verkstadssystem med däckhotell, lager, bokningar, arbetsorder, fakturor och kundregister. Körs i webbläsaren på dator, surfplatta och mobil.',
				applicationCategory: 'BusinessApplication',
				operatingSystem: 'Web',
				inLanguage: 'sv-SE',
				url: `${ORIGIN}/apps/axle`,
				image: `${ORIGIN}/assets/og/catso-axle-og.jpg`,
				screenshot: `${ORIGIN}/assets/imgs/dacklager/desktop-dashboard.webp`,
				featureList: [
					'Däckhotell med regnummer, hyllplats och avgift',
					'Lager med saldo, hyllplats och varning för lågt lager',
					'SMS-inkallning till kunder med däck i hotellet',
					'Bokningskalender per mekaniker',
					'Offert som kunden godkänner via länk i mobilen',
					'Arbetsorder',
					'Faktura och kvitto med moms och löpande nummer',
					'Kunder, bilar och leverantörer',
				],
				publisher: { '@id': `${ORIGIN}/#organization` },
			},
			faqJsonLd(AXLE_FAQ),
			breadcrumbs(['Catso', '/'], ['Produkter', '/produkter'], ['Catso Axle', '/apps/axle']),
		],
	},
};

const PAGE_IMAGE = `${ORIGIN}/assets/og/catso-og.png`;

export const PRODUCTS_SEO: RouteSEO = {
	title: 'Produkter | Catso AI & Robotics',
	description:
		'VERA-01 och Catso AI Sök från Catso AI & Robotics, plus verkstadssystemet Catso Axle och apparna Hemmafest och Poängjakten. Alla våra produkter på ett ställe.',
	canonical: `${ORIGIN}/produkter`,
	og: { type: 'website', image: PAGE_IMAGE },
	twitter: { card: 'summary_large_image', image: PAGE_IMAGE },
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': `${ORIGIN}/produkter#page`,
				name: 'Produkter från Catso',
				url: `${ORIGIN}/produkter`,
				isPartOf: { '@id': `${ORIGIN}/#website` },
				about: { '@id': `${ORIGIN}/#organization` },
				mainEntity: {
					'@type': 'ItemList',
					itemListElement: PRODUCT_LIST.map(([name, path], i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name,
						url: `${ORIGIN}${path}`,
					})),
				},
			},
			breadcrumbs(['Catso', '/'], ['Produkter', '/produkter']),
		],
	},
};

export const ABOUT_SEO: RouteSEO = {
	title: 'Om Catso AI & Robotics',
	description:
		'Catso AI & Robotics bygger AI-agenter och robotik för svenska företag och myndigheter. Läs vad vi gör och hur vi arbetar.',
	canonical: `${ORIGIN}/om-oss`,
	og: { type: 'website', image: PAGE_IMAGE },
	twitter: { card: 'summary_large_image', image: PAGE_IMAGE },
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'AboutPage',
				'@id': `${ORIGIN}/om-oss#page`,
				name: 'Om Catso AI & Robotics',
				url: `${ORIGIN}/om-oss`,
				isPartOf: { '@id': `${ORIGIN}/#website` },
				about: { '@id': `${ORIGIN}/#organization` },
			},
			breadcrumbs(['Catso', '/'], ['Om oss', '/om-oss']),
		],
	},
};

export const KONTAKT_SEO: RouteSEO = {
	title: 'Kontakta Catso | Catso AI & Robotics',
	description:
		'Hör av dig till Catso AI & Robotics om AI-agenten VERA-01, AI-sök för Shopify, robotik eller våra andra system. Mejla support@catso.io eller använd formuläret.',
	canonical: `${ORIGIN}/kontakt`,
	og: { type: 'website', image: PAGE_IMAGE },
	twitter: { card: 'summary_large_image', image: PAGE_IMAGE },
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'ContactPage',
				'@id': `${ORIGIN}/kontakt#page`,
				name: 'Kontakta Catso',
				url: `${ORIGIN}/kontakt`,
				isPartOf: { '@id': `${ORIGIN}/#website` },
				about: { '@id': `${ORIGIN}/#organization` },
			},
			breadcrumbs(['Catso', '/'], ['Kontakt', '/kontakt']),
		],
	},
};

export const INTEGRITET_SEO: RouteSEO = {
	title: 'Integritetspolicy | Catso AI & Robotics',
	description: 'Så hanterar Catso personuppgifter när du besöker catso.io eller skickar ett meddelande.',
	canonical: `${ORIGIN}/integritet`,
	robots: 'index,follow',
};

/** Visas som 404.html på GitHub Pages. Ska aldrig indexeras. */
export const NOT_FOUND_SEO: RouteSEO = {
	title: 'Sidan finns inte | Catso',
	description: 'Sidan du söker finns inte.',
	robots: 'noindex,follow',
};

export const VERA_SEO: RouteSEO = {
	title: 'VERA-01 | AI-agent för svenska advokatbyråer',
	description:
		'VERA-01 är en AI-agent byggd för svenska advokatbyråer. Körs lokalt, tränad på svensk lag. Ingen data lämnar er miljö.',
	canonical: `${ORIGIN}/vera-01`,
	og: { type: 'product', image: `${ORIGIN}/assets/imgs/vera-01/vera01banner00.png` },
	twitter: { card: 'summary_large_image', image: `${ORIGIN}/assets/imgs/vera-01/vera01banner00.png` },
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				'@id': `${ORIGIN}/vera-01#app`,
				name: 'VERA-01',
				applicationCategory: 'BusinessApplication',
				operatingSystem: 'Web',
				url: `${ORIGIN}/vera-01`,
				publisher: { '@id': `${ORIGIN}/#organization` },
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
			},
			breadcrumbs(['Catso', '/'], ['Produkter', '/produkter'], ['VERA-01', '/vera-01']),
		],
	},
};

export const SHOPIFY_SEO: RouteSEO = {
	title: 'Catso AI Sök — AI-sök & shoppingassistent för Shopify',
	description:
		'Byt ut butikens sökruta mot en AI-sökning som förstår vad kunden menar, plus en shoppingassistent som bara rekommenderar produkter du har. Svenska & engelska.',
	canonical: `${ORIGIN}/shopify/apps/ai-search`,
	og: { type: 'website', image: `${ORIGIN}/assets/og/catso-ai-search-og.png` },
	twitter: { card: 'summary_large_image', image: `${ORIGIN}/assets/og/catso-ai-search-og.png` },
	robots: 'index,follow',
	jsonLd: {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				'@id': `${ORIGIN}/shopify/apps/ai-search#app`,
				name: 'Catso AI Sök',
				applicationCategory: 'BusinessApplication',
				operatingSystem: 'Shopify',
				url: `${ORIGIN}/shopify/apps/ai-search`,
				publisher: { '@id': `${ORIGIN}/#organization` },
				offers: { '@type': 'Offer', price: '19', priceCurrency: 'USD' },
			},
			breadcrumbs(['Catso', '/'], ['Produkter', '/produkter'], ['Catso AI Sök', '/shopify/apps/ai-search']),
		],
	},
};

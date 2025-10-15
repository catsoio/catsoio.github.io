import { RouteSEO } from "./seo.types";

// seo/hemmafest.seo.ts
export const HEMMAFEST_SEO: RouteSEO = {
	title: 'Hemmafest! | Joina eller skapa egna fester!',
	description: 'Hitta och skapa fester snabbt och enkelt! Ange festnamn, datum, och voilà!...',
	og: { type: 'product', image: '/assets/imgs/hemmafestbanner.png' },
	twitter: {
		card: 'summary_large_image',
		image: '/assets/imgs/hemmafestbanner.png',
	},
	jsonLd: {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Vera',
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Web',
		url: 'https://catso.io/hemmafest',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
	},
};

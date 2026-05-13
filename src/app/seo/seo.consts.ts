import { RouteSEO } from './seo.types';

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

export const POANGJAKTEN_SEO: RouteSEO = {
	title: 'Poängjakten — Tävla och nå studenter | Catso',
	description:
		'Poängjakten från Catso: gymnasieelever tävlar om att skapa innehåll åt ert varumärke. Bli partner och nå Sveriges studenter.',
	og: {
		type: 'website',
		image: 'https://catso.io/assets/og/catso-og.jpg',
	},
	twitter: {
		card: 'summary_large_image',
		image: 'https://catso.io/assets/og/catso-og.jpg',
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

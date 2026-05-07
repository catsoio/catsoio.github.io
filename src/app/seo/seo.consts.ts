import { RouteSEO } from './seo.types';

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

export const POANGJAKTEN_SEO: RouteSEO = {
	title: 'Poängjakten | Hem',
	description:
		'Gen Z skippar er reklam. I Poängjakten tävlar 100 000 gymnasieelever om att skapa den åt er. Bli partner och nå Sveriges studenter där de faktiskt är.',
	og: {
		type: 'website',
		image: 'https://catso.io/assets/og/catso-og.jpg', // Samma bild som du använder i heron
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

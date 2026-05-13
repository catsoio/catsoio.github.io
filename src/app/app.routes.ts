import { Routes } from '@angular/router';
import { RouteSEO } from './seo/seo.types';
import { HEMMAFEST_SEO, POANGJAKTEN_SEO } from './seo/seo.consts';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },

	{
		path: 'home',
		loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
		data: {
			seo: {
				title: 'Catso — AI-agenter & robotik för svensk industri',
				description:
					'Catso bygger virtuella och fysiska AI-agenter för svenska företag. VERA-01 för juridik, Hemmafest för event, Poängjakten för studenter — och robotik för industrin.',
				og: { type: 'website', image: 'https://catso.io/assets/og/catso-og.jpg' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/og/catso-og.jpg',
				},
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: 'Catso',
					url: 'https://catso.io',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'pricing',
		loadComponent: () =>
			import('./pages/pricing/pricing.component').then((m) => m.PricingComponent),
		data: {
			seo: {
				title: 'Priser — Catso',
				description:
					'Transparenta priser i SEK för Catsos AI-agenter och robotiklösningar. Börja gratis, skala efter behov.',
				og: { type: 'website', image: 'https://catso.io/assets/og/catso-og.jpg' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/og/catso-og.jpg',
				},
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'OfferCatalog',
					name: 'Catso Priser',
					url: 'https://catso.io/pricing',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'docs',
		loadComponent: () => import('./pages/docs/docs.component').then((m) => m.DocsComponent),
		data: {
			seo: {
				title: 'Dokumentation — Catso',
				description:
					'Guider och API-referenser för Catsos AI-agenter och robotikplattform. Kom igång med VERA-01 och mer.',
				og: { type: 'website', image: 'https://catso.io/assets/og/catso-og.jpg' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/og/catso-og.jpg',
				},
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'TechArticle',
					name: 'Catso Dokumentation',
					url: 'https://catso.io/docs',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'blog',
		loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogComponent),
		data: {
			seo: {
				title: 'Blogg — Catso',
				description: 'Nyheter, tekniska artiklar och uppdateringar från Catso om AI-agenter, robotik och svensk tech.',
				og: { type: 'website', image: 'https://catso.io/assets/og/catso-og.jpg' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/og/catso-og.jpg',
				},
			} as RouteSEO,
		},
	},
	// {
	// 	path: 'blog/:slug',
	// 	loadComponent: () => import('./pages/blog/post/post.component').then((m) => m.PostComponent),
	// 	data: {
	// 		// Placeholder; see section 11 for dynamic SEO based on post content
	// 		seo: {
	// 			title: 'Article — Catso',
	// 			robots: 'index,follow',
	// 		} as RouteSEO,
	// 	},
	// },
	{
		path: 'vera-01',
		loadComponent: () => import('./pages/vera-01/vera-01').then((m) => m.Vera01),
		data: {
			seo: {
				title: 'VERA-01 | Lokal AI-agent för advokatbyråer — Catso',
				description:
					'VERA-01 är Catsos AI-agent för svenska advokatbyråer. Analyserar ärenden, genererar utkast och hänvisar till rättskällor — lokalt och GDPR-säkrat.',
				og: { type: 'product', image: 'https://catso.io/assets/imgs/vera01banner3d.png' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/imgs/vera01banner3d.png',
				},
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'SoftwareApplication',
					name: 'VERA-01',
					applicationCategory: 'BusinessApplication',
					operatingSystem: 'Web',
					url: 'https://catso.io/vera-01',
					offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
				},
			} as RouteSEO,
		},
	},
	{
		path: 'poangjakten/sponsor',
		loadComponent: () =>
			import('./pages/poangjakten/poangjakten').then((m) => m.Poangjakten),
		data: { seo: POANGJAKTEN_SEO },
	},
	{
		path: 'hemmafest',
		loadComponent: () =>
			import('./pages/hemmafest/hemmafest.component').then((m) => m.HemmafestComponent),
		data: { seo: HEMMAFEST_SEO },
	},
	{
		path: 'hemmafest/privacy',
		loadComponent: () =>
			import('./pages/hemmafest/policy/policy.component').then((m) => m.PolicyComponent),
		data: { seo: HEMMAFEST_SEO },
	},
	{
		path: 'hemmafest/terms',
		loadComponent: () =>
			import('./pages/hemmafest/terms/terms.component').then((m) => m.TermsComponent),
		data: { seo: HEMMAFEST_SEO },
	},
	{
		path: 'hemmafest/request-delete-account',
		loadComponent: () =>
			import('./pages/hemmafest/request-delete-account/request-delete-account').then(
				(m) => m.RequestDeleteAccount
			),
		data: { seo: HEMMAFEST_SEO },
	},
	{
		path: 'about',
		loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
		data: {
			seo: {
				title: 'Om oss — Catso',
				description:
					'Catso är ett svenskt AI- och robotikbolag. Vi bygger produkter som VERA-01, Hemmafest och Poängjakten.',
				og: { type: 'website', image: 'https://catso.io/assets/og/catso-og.jpg' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/og/catso-og.jpg',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'contact',
		loadComponent: () =>
			import('./pages/contact/contact.component').then((m) => m.ContactComponent),
		data: {
			seo: {
				title: 'Kontakt — Catso',
				description: 'Kontakta Catso för frågor om AI-agenter, robotik, VERA-01 eller enterprise-lösningar.',
				og: { type: 'website', image: 'https://catso.io/assets/og/catso-og.jpg' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/og/catso-og.jpg',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'careers',
		loadComponent: () =>
			import('./pages/careers/careers.component').then((m) => m.CareersComponent),
		data: {
			seo: {
				title: 'Karriär — Catso',
				description: 'Jobba på Catso. Vi söker ingenjörer och kreatörer som vill bygga framtidens AI och robotik.',
				og: { type: 'website', image: 'https://catso.io/assets/og/catso-og.jpg' },
				twitter: {
					card: 'summary_large_image',
					image: 'https://catso.io/assets/og/catso-og.jpg',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'privacy',
		loadComponent: () =>
			import('./pages/legal/privacy/privacy.component').then((m) => m.PrivacyComponent),
		data: {
			seo: {
				title: 'Privacy Policy — Catso',
				description: 'How Catso collects, uses, and protects your data.',
				og: { type: 'article', image: '/assets/og/catso-legal-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-legal-1200x630.png',
				},
				robots: 'index,follow',
			} as RouteSEO,
		},
	},
	{
		path: 'terms',
		loadComponent: () =>
			import('./pages/legal/terms/terms.component').then((m) => m.TermsComponent),
		data: {
			seo: {
				title: 'Terms of Service — Catso',
				description: 'The terms and conditions that govern your use of Catso.',
				og: { type: 'article', image: '/assets/og/catso-legal-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-legal-1200x630.png',
				},
				robots: 'index,follow',
			} as RouteSEO,
		},
	},
	// Auth / app areas (noindex)
	{
		path: 'login',
		loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
		data: {
			seo: { title: 'Login — Catso', robots: 'noindex,follow' } as RouteSEO,
		},
	},
	{
		path: 'signup',
		loadComponent: () =>
			import('./pages/auth/signup/signup.component').then((m) => m.SignupComponent),
		data: {
			seo: {
				title: 'Create your account — Catso',
				robots: 'noindex,follow',
			} as RouteSEO,
		},
	},
	{ path: '**', redirectTo: 'home' },
];

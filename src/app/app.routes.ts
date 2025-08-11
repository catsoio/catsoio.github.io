import { Routes } from '@angular/router';
import { RouteSEO } from './seo/seo.types';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./pages/home/home.component').then((m) => m.HomeComponent),
		data: {
			seo: {
				title: 'Catso — Developer-first PaaS',
				description:
					'Ship SaaS faster with a Turborepo-powered PaaS. NestJS backends, Angular frontends, SSR, CI/CD, and observability built in.',
				og: { type: 'website', image: '/assets/og/catso-home-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-home-1200x630.png',
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
			import('./pages/pricing/pricing.component').then(
				(m) => m.PricingComponent
			),
		data: {
			seo: {
				title: 'Pricing — Catso',
				description:
					'Simple, transparent pricing in SEK. Start free, scale predictably across environments and teams.',
				og: { type: 'website', image: '/assets/og/catso-pricing-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-pricing-1200x630.png',
				},
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'OfferCatalog',
					name: 'Catso Pricing',
					url: 'https://catso.io/pricing',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'docs',
		loadComponent: () =>
			import('./pages/docs/docs.component').then((m) => m.DocsComponent),
		data: {
			seo: {
				title: 'Docs — Catso',
				description:
					'Guides, quickstarts, and API references for building on Catso with NestJS and Angular.',
				og: { type: 'website', image: '/assets/og/catso-docs-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-docs-1200x630.png',
				},
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'TechArticle',
					name: 'Catso Documentation',
					url: 'https://catso.io/docs',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'blog',
		loadComponent: () =>
			import('./pages/blog/blog.component').then((m) => m.BlogComponent),
		data: {
			seo: {
				title: 'Blog — Catso',
				description:
					'Engineering notes, platform updates, and guides for modern SaaS teams.',
				og: { type: 'website', image: '/assets/og/catso-blog-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-blog-1200x630.png',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'blog/:slug',
		loadComponent: () =>
			import('./pages/blog/post/post.component').then((m) => m.PostComponent),
		data: {
			// Placeholder; see section 11 for dynamic SEO based on post content
			seo: {
				title: 'Article — Catso',
				robots: 'index,follow',
			} as RouteSEO,
		},
	},
	{
		path: 'vera',
		loadComponent: () =>
			import('./pages/vera/vera.component').then((m) => m.VeraComponent),
		data: {
			seo: {
				title: 'Vera — AI Legal Assistant for Swedish Law Firms',
				description:
					'Vera helps lawyers draft, review, and search across case materials with private AI. Built for Swedish legal workflows, secure by design.',
				og: { type: 'product', image: '/assets/og/vera-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/vera-1200x630.png',
				},
				jsonLd: {
					'@context': 'https://schema.org',
					'@type': 'SoftwareApplication',
					name: 'Vera',
					applicationCategory: 'BusinessApplication',
					operatingSystem: 'Web',
					url: 'https://catso.io/vera',
					offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
				},
			} as RouteSEO,
		},
	},
	{
		path: 'about',
		loadComponent: () =>
			import('./pages/about/about.component').then((m) => m.AboutComponent),
		data: {
			seo: {
				title: 'About — Catso',
				description:
					'We’re building the developer-first PaaS to help teams move from idea to production faster.',
				og: { type: 'website', image: '/assets/og/catso-about-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-about-1200x630.png',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'contact',
		loadComponent: () =>
			import('./pages/contact/contact.component').then(
				(m) => m.ContactComponent
			),
		data: {
			seo: {
				title: 'Contact — Catso',
				description:
					'Talk to our team about Catso, enterprise options, and Vera for legal teams.',
				og: { type: 'website', image: '/assets/og/catso-contact-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-contact-1200x630.png',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'careers',
		loadComponent: () =>
			import('./pages/careers/careers.component').then(
				(m) => m.CareersComponent
			),
		data: {
			seo: {
				title: 'Careers — Catso',
				description: 'Join us to build the PaaS developers love.',
				og: { type: 'website', image: '/assets/og/catso-careers-1200x630.png' },
				twitter: {
					card: 'summary_large_image',
					image: '/assets/og/catso-careers-1200x630.png',
				},
			} as RouteSEO,
		},
	},
	{
		path: 'privacy',
		loadComponent: () =>
			import('./pages/legal/privacy/privacy.component').then(
				(m) => m.PrivacyComponent
			),
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
			import('./pages/legal/terms/terms.component').then(
				(m) => m.TermsComponent
			),
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
		loadComponent: () =>
			import('./pages/auth/login/login.component').then(
				(m) => m.LoginComponent
			),
		data: {
			seo: { title: 'Login — Catso', robots: 'noindex,follow' } as RouteSEO,
		},
	},
	{
		path: 'signup',
		loadComponent: () =>
			import('./pages/auth/signup/signup.component').then(
				(m) => m.SignupComponent
			),
		data: {
			seo: {
				title: 'Create your account — Catso',
				robots: 'noindex,follow',
			} as RouteSEO,
		},
	},
	{
		path: 'dashboard',
		loadComponent: () =>
			import('./pages/dashboard/dashboard.component').then(
				(m) => m.DashboardComponent
			),
		data: {
			seo: {
				title: 'Dashboard — Catso',
				robots: 'noindex,nofollow',
			} as RouteSEO,
		},
	},
	{ path: '**', redirectTo: '' },
];

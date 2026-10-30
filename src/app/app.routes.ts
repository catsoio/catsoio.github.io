import { Routes } from '@angular/router';
import { RouteSEO } from './seo/seo.types';
import {
  HEMMAFEST_SEO,
  HEMMAFEST_BUSINESS_SEO,
  HEMMAFEST_DELETE_SEO,
  HEMMAFEST_PRIVACY_SEO,
  HEMMAFEST_TERMS_SEO,
  HOME_SEO,
  AXLE_SEO,
  AXLE_INFO_SEO,
  KOM_IGANG_SEO,
  POANGJAKTEN_SEO,
} from './seo/seo.consts';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { seo: HOME_SEO },
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { seo: HOME_SEO },
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./pages/pricing/pricing.component').then((m) => m.PricingComponent),
    data: {
      seo: { title: 'Priser — Catso AI & Robotics', robots: 'noindex,nofollow' } as RouteSEO,
    },
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs.component').then((m) => m.DocsComponent),
    data: {
      seo: { title: 'Dokumentation — Catso AI & Robotics', robots: 'noindex,nofollow' } as RouteSEO,
    },
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogComponent),
    data: { seo: { title: 'Blogg — Catso AI & Robotics', robots: 'noindex,nofollow' } as RouteSEO },
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
        title: 'VERA-01 | AI-agent för svenska advokatbyråer',
        description:
          'VERA-01 är en AI-agent byggd för svenska advokatbyråer. Körs lokalt, tränad på svensk lag. Ingen data lämnar er miljö.',
        og: { type: 'product', image: 'https://catso.io/assets/imgs/vera-01/vera01banner00.png' },
        twitter: {
          card: 'summary_large_image',
          image: 'https://catso.io/assets/imgs/vera-01/vera01banner00.png',
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
    path: 'apps/axle',
    loadComponent: () =>
      import('./pages/axle-landing/axle-landing.component').then(
        (m) => m.AxleLandingComponent,
      ),
    data: { seo: AXLE_SEO },
  },
  { path: 'verkstad', redirectTo: 'apps/axle', pathMatch: 'full' },
  { path: 'apps/verkstad', redirectTo: 'apps/axle', pathMatch: 'full' },
  { path: 'verkstad/kom-igang', redirectTo: 'axle/kom-igang', pathMatch: 'full' },
  { path: 'verkstad/info', redirectTo: 'axle/info', pathMatch: 'full' },
  {
    path: 'axle/kom-igang',
    loadComponent: () =>
      import('./pages/kom-igang/kom-igang.component').then((m) => m.KomIgangComponent),
    data: { seo: KOM_IGANG_SEO },
  },
  {
    path: 'axle/info',
    loadComponent: () =>
      import('./pages/axle-info/axle-info.component').then((m) => m.AxleInfoComponent),
    data: { seo: AXLE_INFO_SEO },
  },
  {
    path: 'poangjakten/sponsor',
    loadComponent: () => import('./pages/poangjakten/poangjakten').then((m) => m.Poangjakten),
    data: { seo: POANGJAKTEN_SEO },
  },
  {
    path: 'hemmafest',
    loadComponent: () =>
      import('./pages/hemmafest/hemmafest.component').then((m) => m.HemmafestComponent),
    data: { seo: HEMMAFEST_SEO },
  },
  {
    path: 'hemmafest/business',
    loadComponent: () =>
      import('./pages/hemmafest/business/business.component').then((m) => m.BusinessComponent),
    data: { seo: HEMMAFEST_BUSINESS_SEO },
  },
  {
    path: 'hemmafest/privacy',
    loadComponent: () =>
      import('./pages/hemmafest/policy/policy.component').then((m) => m.PolicyComponent),
    data: { seo: HEMMAFEST_PRIVACY_SEO },
  },
  {
    path: 'hemmafest/terms',
    loadComponent: () =>
      import('./pages/hemmafest/terms/terms.component').then((m) => m.TermsComponent),
    data: { seo: HEMMAFEST_TERMS_SEO },
  },
  {
    path: 'hemmafest/request-delete-account',
    loadComponent: () =>
      import('./pages/hemmafest/request-delete-account/request-delete-account').then(
        (m) => m.RequestDeleteAccount,
      ),
    data: { seo: HEMMAFEST_DELETE_SEO },
  },
  { path: 'dacklager', redirectTo: 'apps/axle', pathMatch: 'full' },
  { path: 'inventory', redirectTo: 'apps/axle', pathMatch: 'full' },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    data: {
      seo: { title: 'Catso Admin', robots: 'noindex,nofollow' } as RouteSEO,
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
    data: {
      seo: { title: 'Om oss — Catso AI & Robotics', robots: 'noindex,nofollow' } as RouteSEO,
    },
  },
  {
    path: 'shopify/ai-search',
    redirectTo: 'shopify/apps/ai-search',
    pathMatch: 'full',
  },
  {
    path: 'shopify/apps/ai-search',
    loadComponent: () =>
      import('./pages/shopify-ai-search/shopify-ai-search.component').then(
        (m) => m.ShopifyAiSearchComponent,
      ),
    data: {
      seo: {
        title: 'Catso AI Sök — AI-sök & shoppingassistent för Shopify',
        description:
          'Byt ut butikens sökruta mot en AI-sökning som förstår vad kunden menar, plus en shoppingassistent som bara rekommenderar produkter du har. Svenska & engelska.',
        og: { type: 'website', image: 'https://catso.io/assets/og/catso-ai-search-og.png' },
        twitter: {
          card: 'summary_large_image',
          image: 'https://catso.io/assets/og/catso-ai-search-og.png',
        },
        robots: 'index,follow',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Catso AI Sök',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Shopify',
          url: 'https://catso.io/shopify/apps/ai-search',
          offers: { '@type': 'Offer', price: '19', priceCurrency: 'USD' },
        },
      } as RouteSEO,
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    data: {
      seo: { title: 'Kontakt — Catso AI & Robotics', robots: 'noindex,nofollow' } as RouteSEO,
    },
  },
  {
    path: 'careers',
    loadComponent: () =>
      import('./pages/careers/careers.component').then((m) => m.CareersComponent),
    data: {
      seo: { title: 'Karriär — Catso AI & Robotics', robots: 'noindex,nofollow' } as RouteSEO,
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
        og: { type: 'article', image: '/assets/og/catso-og.png' },
        twitter: {
          card: 'summary_large_image',
          image: '/assets/og/catso-og.png',
        },
        robots: 'noindex,follow',
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
        og: { type: 'article', image: '/assets/og/catso-og.png' },
        twitter: {
          card: 'summary_large_image',
          image: '/assets/og/catso-og.png',
        },
        robots: 'noindex,follow',
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
  { path: '**', redirectTo: '' },
];

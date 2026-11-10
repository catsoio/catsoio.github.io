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
  AXLE_PRISER_SEO,
  axleModulSeo,
  KOM_IGANG_SEO,
  POANGJAKTEN_SEO,
  PRODUCTS_SEO,
  ABOUT_SEO,
  KONTAKT_SEO,
  INTEGRITET_SEO,
  NOT_FOUND_SEO,
  VERA_SEO,
  SHOPIFY_SEO,
} from './seo/seo.consts';
import { MODULER } from './pages/axle-modul/axle-moduler.data';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { seo: HOME_SEO },
  },
  {
    path: 'produkter',
    loadComponent: () =>
      import('./pages/products/products.component').then((m) => m.ProductsComponent),
    data: { seo: PRODUCTS_SEO },
  },
  {
    path: 'om-oss',
    loadComponent: () => import('./pages/company/about.component').then((m) => m.AboutComponent),
    data: { seo: ABOUT_SEO },
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./pages/kontakt/kontakt.component').then((m) => m.KontaktComponent),
    data: { seo: KONTAKT_SEO },
  },
  {
    path: 'integritet',
    loadComponent: () =>
      import('./pages/integritet/integritet.component').then((m) => m.IntegritetComponent),
    data: { seo: INTEGRITET_SEO },
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
    data: { seo: VERA_SEO, footer: true },
  },
  {
    path: 'apps/axle',
    loadComponent: () =>
      import('./pages/axle-landing/axle-landing.component').then(
        (m) => m.AxleLandingComponent,
      ),
    data: { seo: AXLE_SEO, footer: true },
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
  // /axle/dackhotell, /axle/tidsbokning, /axle/offert, /axle/lager och /axle/arbetsorder
  ...MODULER.map((m) => ({
    path: `axle/${m.slug}`,
    loadComponent: () =>
      import('./pages/axle-modul/axle-modul.component').then((c) => c.AxleModulComponent),
    data: { seo: axleModulSeo(m), modul: m.slug },
  })),
  {
    path: 'axle/priser',
    loadComponent: () =>
      import('./pages/axle-priser/axle-priser.component').then((m) => m.AxlePriserComponent),
    data: { seo: AXLE_PRISER_SEO },
  },
  {
    path: 'poangjakten/sponsor',
    loadComponent: () => import('./pages/poangjakten/poangjakten').then((m) => m.Poangjakten),
    data: { seo: POANGJAKTEN_SEO, footer: true },
  },
  {
    path: 'hemmafest',
    loadComponent: () =>
      import('./pages/hemmafest/hemmafest.component').then((m) => m.HemmafestComponent),
    data: { seo: HEMMAFEST_SEO, footer: true },
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
    data: { seo: SHOPIFY_SEO, footer: true },
  },
  {
    path: 'careers',
    loadComponent: () =>
      import('./pages/careers/careers.component').then((m) => m.CareersComponent),
    data: {
      seo: { title: 'Karriär — Catso AI & Robotics', robots: 'noindex,nofollow' } as RouteSEO,
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
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { seo: NOT_FOUND_SEO },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { seo: NOT_FOUND_SEO },
  },
];

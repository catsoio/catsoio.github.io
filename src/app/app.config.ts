import {
	APP_INITIALIZER,
	ApplicationConfig,
	inject,
	provideZoneChangeDetection,
} from '@angular/core';
import {
	provideRouter,
	TitleStrategy,
	withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, Title, Meta } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { DEFAULT_SEO } from './seo/defaults.token';
import { SeoTitleStrategy } from './seo/seo-title.strategy';
import { SeoService } from './seo/seo.service';
import { DefaultSeo } from './seo/seo.types';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({ scrollPositionRestoration: 'top' })
		),
		provideHttpClient(),
		provideClientHydration(),
		provideServerRendering(),
		Title,
		Meta,
		{
			provide: DEFAULT_SEO,
			useValue: {
				siteName: 'Catso',
				origin: 'https://catso.io',
				defaultDescription:
					'Developer-first PaaS to build, extend, and ship apps faster.',
				defaultImage: '/assets/og/catso-og.png',
				locale: 'en_US', // or 'sv_SE' if your primary audience is Swedish
			} as DefaultSeo,
		},
		{ provide: TitleStrategy, useClass: SeoTitleStrategy },
		{
			provide: APP_INITIALIZER,
			multi: true,
			useFactory: () => {
				const seo = inject(SeoService);
				return () => seo.init();
			},
		},
		provideHttpClient(withFetch()),
	],
};

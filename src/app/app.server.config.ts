import {
	APP_INITIALIZER,
	ApplicationConfig,
	inject,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';

import { DEFAULT_SEO } from './seo/defaults.token';
import { SeoTitleStrategy } from './seo/seo-title.strategy';
import { SeoService } from './seo/seo.service';
import { DefaultSeo } from './seo/seo.types';

export const appServerConfig: ApplicationConfig = {
	providers: [
		provideServerRendering(), // <-- important on server
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({
				scrollPositionRestoration: 'top',
				anchorScrolling: 'enabled',
			})
		),
		provideHttpClient(withFetch()),
		Title,
		Meta,
		{
			provide: DEFAULT_SEO,
			useValue: {
				siteName: 'Catso',
				origin: 'https://catso.io',
				defaultDescription: 'Catso bygger AI-agenter och robotiklösningar för svenska företag. VERA-01, Hemmafest, Poängjakten och mer.',
				defaultImage: 'https://catso.io/assets/og/catso-og.jpg',
				locale: 'sv_SE',
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
	],
};

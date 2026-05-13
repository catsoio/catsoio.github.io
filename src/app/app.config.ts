import {
	APP_INITIALIZER,
	ApplicationConfig,
	inject,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Title, Meta, provideClientHydration } from '@angular/platform-browser';

import { DEFAULT_SEO } from './seo/defaults.token';
import { SeoTitleStrategy } from './seo/seo-title.strategy';
import { SeoService } from './seo/seo.service';
import { DefaultSeo } from './seo/seo.types';

export const appConfig: ApplicationConfig = {
	providers: [
		provideClientHydration(), // browser only
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
				siteName: 'Catso AI & Robotics',
				origin: 'https://catso.io',
				defaultDescription: 'Catso AI & Robotics bygger AI-agenter och robotiklösningar för svenska företag och myndigheter.',
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

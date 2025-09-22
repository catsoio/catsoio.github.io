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
import { DEFAULT_SEO } from './seo/defaults.token';
import { SeoTitleStrategy } from './seo/seo-title.strategy';
import { SeoService } from './seo/seo.service';
import { DefaultSeo } from './seo/seo.types';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({
				scrollPositionRestoration: 'top',
				anchorScrolling: 'enabled',
			})
		),
		// Välj EN http-client-registrering
		provideHttpClient(withFetch()),

		Title,
		Meta,
		{
			provide: DEFAULT_SEO,
			useValue: {
				siteName: 'catso',
				origin: 'https://catso.io',
				defaultDescription: 'Getting blessed.',
				defaultImage: '/assets/og/catso-og.png',
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

import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { DEFAULT_SEO } from './defaults.token';
import { DefaultSeo, RouteSEO } from './seo.types';

@Injectable({ providedIn: 'root' })
export class SeoService {
	private renderer: Renderer2;
	private ldJsonEl?: HTMLScriptElement;

	constructor(
		private readonly router: Router,
		private readonly meta: Meta,
		@Inject(DOCUMENT) private readonly doc: Document,
		rendererFactory: RendererFactory2,
		@Inject(DEFAULT_SEO) private readonly defaults: DefaultSeo
	) {
		this.renderer = rendererFactory.createRenderer(null, null);
	}

	/** Call once at app bootstrap */
	init() {
		this.router.events
			.pipe(
				filter((e): e is NavigationEnd => e instanceof NavigationEnd),
				startWith(null)
			)
			.subscribe(() => this.applyForCurrentRoute());
	}

	private applyForCurrentRoute() {
		const leaf = this.deepest(this.router.routerState.snapshot.root);
		const seo: RouteSEO | undefined = leaf.data?.['seo'];

		const title = seo?.title ?? this.defaults.siteName;
		const desc = seo?.description ?? this.defaults.defaultDescription;
		const robots = seo?.robots ?? 'index,follow';
		const url = seo?.canonical ?? this.absUrl();
		const image = this.toAbs(
			seo?.og?.image ?? seo?.twitter?.image ?? this.defaults.defaultImage
		);

		// Standard meta
		this.meta.updateTag({ name: 'description', content: desc });
		this.meta.updateTag({ name: 'robots', content: robots });

		// Open Graph
		this.meta.updateTag({
			property: 'og:title',
			content: seo?.og?.title ?? title,
		});
		this.meta.updateTag({
			property: 'og:description',
			content: seo?.og?.description ?? desc,
		});
		this.meta.updateTag({
			property: 'og:type',
			content: seo?.og?.type ?? 'website',
		});
		this.meta.updateTag({ property: 'og:url', content: url });
		this.meta.updateTag({ property: 'og:image', content: image });
		this.meta.updateTag({
			property: 'og:site_name',
			content: this.defaults.siteName,
		});
		if (this.defaults.locale)
			this.meta.updateTag({
				property: 'og:locale',
				content: this.defaults.locale,
			});

		// Twitter
		this.meta.updateTag({
			name: 'twitter:card',
			content: seo?.twitter?.card ?? 'summary_large_image',
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: seo?.twitter?.title ?? title,
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content: seo?.twitter?.description ?? desc,
		});
		this.meta.updateTag({ name: 'twitter:image', content: image });

		// Canonical
		this.setCanonical(url);

		// JSON-LD
		this.setJsonLd(seo?.jsonLd ?? null, url);
	}

	private deepest(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
		let cursor = route;
		while (cursor.firstChild) cursor = cursor.firstChild;
		return cursor;
	}

	private absUrl(): string {
		// Build absolute URL from configured origin + current path (no query/hash)
		const path = this.router.url.split('#')[0];
		const bare = path.includes('?')
			? path.substring(0, path.indexOf('?'))
			: path;
		return `${this.defaults.origin}${bare}`;
	}

	private toAbs(input: string): string {
		if (!input) return `${this.defaults.origin}/assets/og-fallback.png`;
		if (/^https?:\/\//i.test(input)) return input;
		return `${this.defaults.origin}${input.startsWith('/') ? '' : '/'}${input}`;
	}

	private setCanonical(url: string) {
		let link: HTMLLinkElement | null = this.doc.querySelector(
			'link[rel="canonical"]'
		);
		if (!link) {
			link = this.renderer.createElement('link');
			this.renderer.setAttribute(link, 'rel', 'canonical');
			this.renderer.appendChild(this.doc.head, link);
		}
		this.renderer.setAttribute(link, 'href', url);
	}

	private setJsonLd(data: any | null, url: string) {
		if (this.ldJsonEl) {
			this.renderer.removeChild(this.doc.head, this.ldJsonEl);
			this.ldJsonEl = undefined;
		}
		if (!data) return;

		const payload = typeof data === 'function' ? data(url) : data;
		const script = this.renderer.createElement('script');
		this.renderer.setAttribute(script, 'type', 'application/ld+json');
		this.renderer.appendChild(
			script,
			this.renderer.createText(JSON.stringify(payload))
		);
		this.renderer.appendChild(this.doc.head, script);
		this.ldJsonEl = script as HTMLScriptElement;
	}
}

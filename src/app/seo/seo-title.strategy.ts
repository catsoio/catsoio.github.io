import { Injectable, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	TitleStrategy,
} from '@angular/router';
import { DEFAULT_SEO } from './defaults.token';
import { DefaultSeo } from './seo.types';

@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
	constructor(
		private readonly title: Title,
		@Inject(DEFAULT_SEO) private readonly defaults: DefaultSeo
	) {
		super();
	}

	override updateTitle(snapshot: RouterStateSnapshot): void {
		const pageTitle =
			this.extractLeafSeoTitle(snapshot.root) ?? this.defaults.siteName;
		// Titlar som redan nämner Catso får inget suffix, annars blir de för långa.
		const full = /catso/i.test(pageTitle)
			? pageTitle
			: `${pageTitle} • ${this.defaults.siteName}`;
		this.title.setTitle(full);
	}

	private extractLeafSeoTitle(route: ActivatedRouteSnapshot): string | null {
		let cursor: ActivatedRouteSnapshot | null = route;
		while (cursor?.firstChild) cursor = cursor.firstChild;
		return (cursor?.data?.['seo']?.title as string) ?? null;
	}
}

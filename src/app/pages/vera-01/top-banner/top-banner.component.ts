import { isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, inject, PLATFORM_ID } from '@angular/core';

@Component({
	selector: 'app-top-banner',
	standalone: true,
	imports: [],
	templateUrl: './top-banner.component.html',
	styleUrl: './top-banner.component.scss',
})
export class TopBannerComponent {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly doc = inject(DOCUMENT);
	private readonly isBrowser = isPlatformBrowser(this.platformId);
	readonly currentMonth = new Date().toLocaleString('sv-SE', { month: 'long' });

	scrollTo(id: string, ev?: Event): void {
		if (ev) ev.preventDefault();
		if (!this.isBrowser) return;
		const el = this.doc.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}

import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';

@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'], // <-- fixat (plural)
})
export class NavComponent {
	menuOpen = false;
	activeId: string = 'home';
	private observer?: IntersectionObserver;

	private readonly sections = ['home', 'how', 'security', 'expertis', 'faq', 'contact'];

	// Injecta för SSR-säker DOM-åtkomst och plattformskoll
	private readonly platformId = inject(PLATFORM_ID);
	private readonly doc = inject(DOCUMENT);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	toggleMenu(): void {
		this.menuOpen = !this.menuOpen;
	}

	scrollTo(id: string, ev?: Event): void {
		if (ev) ev.preventDefault();
		if (!this.isBrowser) return;
		const el = this.doc.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			this.menuOpen = false;
		}
	}

	linkClasses(id: string): Record<string, boolean> {
		return {
			'opacity-100 text-white': this.activeId === id,
			'opacity-70 hover:opacity-90 text-white': this.activeId !== id,
			transition: true,
		};
	}

	mobileLinkClasses(id: string): Record<string, boolean> {
		return {
			'px-3 py-2 rounded-xl': true,
			'bg-white/10 text-white': this.activeId === id,
			'text-white/90 hover:bg-white/5': this.activeId !== id,
		};
	}

	ngAfterViewInit(): void {
		// Kör inget på servern
		if (!this.isBrowser) return;

		const opts: IntersectionObserverInit = {
			root: null,
			rootMargin: '0px 0px -55% 0px',
			threshold: 0.25,
		};

		this.observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target instanceof this.doc.defaultView!.HTMLElement) {
					const id = (entry.target as HTMLElement).id;
					if (this.sections.includes(id)) this.activeId = id;
				}
			});
		}, opts);

		this.sections.forEach((id) => {
			const el = this.doc.getElementById(id);
			if (el) this.observer!.observe(el);
		});
	}

	ngOnDestroy(): void {
		this.observer?.disconnect();
	}
}

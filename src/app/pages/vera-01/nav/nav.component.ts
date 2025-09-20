import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './nav.component.html',
	styleUrl: './nav.component.scss',
})
export class NavComponent {
	menuOpen = false;
	activeId: string = 'home';
	private observer?: IntersectionObserver;

	// Lista över sektioner som finns på sidan
	private readonly sections = [
		'home',
		'how',
		'security',
		'expertis',
		'faq',
		'contact',
	];

	toggleMenu(): void {
		this.menuOpen = !this.menuOpen;
	}

	scrollTo(id: string, ev?: Event): void {
		if (ev) ev.preventDefault();
		// Mjuk scroll till element med offset hanteras via CSS scroll-margin-top (se styles nedan)
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			this.menuOpen = false; // stäng meny på mobil
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
		// Markera aktiv länk baserat på scrollposition
		const opts: IntersectionObserverInit = {
			root: null,
			// Ett negativt bottom-margin gör att sektionen "räknas" som aktiv lite tidigare
			rootMargin: '0px 0px -55% 0px',
			threshold: 0.25,
		};

		this.observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target instanceof HTMLElement) {
					const id = entry.target.id;
					if (this.sections.includes(id)) {
						this.activeId = id;
					}
				}
			});
		}, opts);

		// Starta bevakning av respektive sektion om den finns i DOM
		this.sections.forEach((id) => {
			const el = document.getElementById(id);
			if (el) this.observer!.observe(el);
		});
	}

	ngOnDestroy(): void {
		this.observer?.disconnect();
	}
}

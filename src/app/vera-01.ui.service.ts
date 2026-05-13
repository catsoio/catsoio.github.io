import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class Vera01UiService {
	private platformId = inject(PLATFORM_ID);

	// States
	scrolled = signal(false);
	mobileMenuOpen = signal(false);

	constructor() {
		if (isPlatformBrowser(this.platformId)) {
			window.addEventListener('scroll', () => {
				this.scrolled.set(window.scrollY > 32);
			});
		}
	}

	// Actions
	toggleMobileMenu() {
		this.mobileMenuOpen.update((val) => !val);
	}

	closeMobileMenu() {
		this.mobileMenuOpen.set(false);
	}

	scrollTo(id: string, event?: Event) {
		if (event) {
			event.preventDefault();
		}

		this.closeMobileMenu();

		if (isPlatformBrowser(this.platformId)) {
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}
}

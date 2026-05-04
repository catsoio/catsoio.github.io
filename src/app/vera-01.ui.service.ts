import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class Vera01UiService {
	// States
	scrolled = signal(false);
	mobileMenuOpen = signal(false);

	constructor() {
		// Hantera scroll-logiken centralt
		window.addEventListener('scroll', () => {
			this.scrolled.set(window.scrollY > 32);
		});
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

		this.closeMobileMenu(); // Stäng menyn om man navigerar

		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
}

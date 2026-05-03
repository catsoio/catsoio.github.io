import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
	selector: 'app-vera01hero',
	imports: [CommonModule],

	templateUrl: './vera01hero.html',
	styleUrl: './vera01hero.scss',
})
export class Vera01hero implements OnInit, AfterViewInit {
	activeView: 'chatgpt' | 'vera' = 'chatgpt';

	chatGptJourney = [
		{
			id: 'cg-1',
			title: 'Klientdata skickas',
			desc: 'Ärendeinfo matas in i en molntjänst.',
			colorClass: 'bg-slate-300 shadow-slate-300/30',
			iconPath:
				'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
		},
		{
			id: 'cg-2',
			title: 'Lämnar EU',
			desc: 'Servrar i USA — GDPR-skyddet försvagas.',
			colorClass: 'bg-amber-400 shadow-amber-400/40',
			iconPath:
				'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			id: 'cg-3',
			title: 'Tränar modellen',
			desc: 'Klientdata blir del av AI:ns kunskapsbas.',
			colorClass: 'bg-red-500 shadow-red-500/40',
			iconPath:
				'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
		},
		{
			id: 'cg-4',
			title: 'Myndigheter får åtkomst',
			desc: 'CLOUD Act — tystnadsplikten bruten.',
			colorClass: 'bg-red-600 shadow-red-600/50',
			iconPath:
				'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
		},
	];

	veraJourney = [
		{
			id: 'v-1',
			title: 'Klientdata skickas',
			desc: 'Ärendeinfo matas in — precis som vanligt.',
			colorClass: 'bg-emerald-600 shadow-emerald-600/20',
			iconPath:
				'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
		},
		{
			id: 'v-2',
			title: 'Stannar i Sverige',
			desc: 'Processas lokalt — aldrig utanför er kontroll.',
			colorClass: 'bg-emerald-500 shadow-emerald-500/30',
			iconPath:
				'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		},
		{
			id: 'v-3',
			title: 'Ingen datalagring',
			desc: 'Raderas omedelbart — används aldrig',
			colorClass: 'bg-emerald-500 shadow-emerald-500/40',
			iconPath:
				'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
		},
		{
			id: 'v-4',
			title: 'Full kontroll',
			desc: 'Sekretessen intakt — ni äger all data.',
			colorClass: 'bg-emerald-400 shadow-emerald-400/50',
			iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		},
	];

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		if (isPlatformBrowser(this.platformId)) {
			gsap.registerPlugin(ScrollTrigger);
		}
	}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.initAnimations();
		}
	}

	private animateCard(view: 'chatgpt' | 'vera'): void {
		const isCg = view === 'chatgpt';
		const lineH = isCg ? '#line-cg-h' : '#line-vera-h';
		const lineV = isCg ? '#line-cg-v' : '#line-vera-v';
		const stepClass = isCg ? '.cg-step' : '.vera-step';
		const bannerSelector = isCg ? '.gsap-warning' : '.gsap-success';

		// Reset
		gsap.set(`${stepClass} .gsap-node`, { opacity: 0, scale: 0.5 });
		gsap.set(`${stepClass} .gsap-content`, { opacity: 0, y: 20 });
		gsap.set(lineH, { scaleX: 0 });
		gsap.set(lineV, { scaleY: 0 });
		gsap.set(bannerSelector, { opacity: 0, y: 10 });

		const tl = gsap.timeline({ delay: 0.15 });
		const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

		if (isDesktop) {
			tl.to(lineH, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' })
				.to(
					`${stepClass} .gsap-node`,
					{ opacity: 1, scale: 1, stagger: 0.15, ease: 'back.out(1.7)' },
					'-=0.9'
				)
				.to(
					`${stepClass} .gsap-content`,
					{ opacity: 1, y: 0, stagger: 0.15, ease: 'power2.out' },
					'-=0.7'
				);
		} else {
			tl.to(lineV, { scaleY: 1, duration: 1.5, ease: 'none' })
				.to(
					`${stepClass} .gsap-node`,
					{ opacity: 1, scale: 1, stagger: 0.3, ease: 'back.out(1.7)' },
					'-=1.3'
				)
				.to(
					`${stepClass} .gsap-content`,
					{ opacity: 1, y: 0, stagger: 0.3, ease: 'power2.out' },
					'-=1.1'
				);
		}

		tl.to(bannerSelector, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3');
	}

	scrollTo(id: string, event: Event): void {
		event.preventDefault();
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	private initAnimations(): void {
		// Header — animates on load (hero is first thing visible)
		gsap.to('.gsap-header', {
			opacity: 1,
			y: 0,
			duration: 1,
			delay: 0.2,
			ease: 'power3.out',
		});

		// Toggle
		gsap.to('.gsap-toggle', {
			opacity: 1,
			duration: 0.6,
			delay: 0.8,
			ease: 'power2.out',
		});

		// Animate initial card after toggle appears
		setTimeout(() => this.animateCard(this.activeView), 1000);

		// Re-animate on toggle — use a getter pattern via MutationObserver or simpler: patch the setter
		const originalView = this.activeView;
		let lastView = originalView;

		// Poll-free approach: override the property
		const self = this;
		const descriptor = {
			get(): 'chatgpt' | 'vera' {
				return lastView;
			},
			set(val: 'chatgpt' | 'vera') {
				if (val !== lastView) {
					lastView = val;
					// Kort delay så Angular hinner rendera
					setTimeout(() => self.animateCard(val), 50);
				}
			},
		};
		Object.defineProperty(this, 'activeView', descriptor);
		// Trigger initial value through setter
		this.activeView = originalView;
	}
}

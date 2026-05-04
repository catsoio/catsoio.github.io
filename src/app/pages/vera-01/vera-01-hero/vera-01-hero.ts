import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	Inject,
	PLATFORM_ID,
	ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
	selector: 'app-vera-01-hero',
	imports: [],
	templateUrl: './vera-01-hero.html',
	styleUrl: './vera-01-hero.scss',
})
export class Vera01Hero implements AfterViewInit {
	@ViewChild('comparisonContainer', { static: false })
	comparisonContainer!: ElementRef<HTMLDivElement>;

	sliderPos = 50;
	isDragging = false;
	chatGptJourney = [
		{
			id: 'cg-1',
			title: 'Prompt med klientdata',
			desc: 'avslagsbeslut.pdf · 34 sidor',
			fileIconPath:
				'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			colorClass: 'bg-slate-300 shadow-slate-300/30',
			iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
		},
		{
			id: 'cg-2',
			title: 'Data lämnar EU',
			desc: 'Processas i USA. Tredjelandsöverföring. Brott mot GDPR.',
			colorClass: 'bg-amber-400 shadow-amber-400/40',
			iconPath:
				'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		},
		{
			id: 'cg-3',
			title: 'Sekretessen röjs',
			desc: 'Klientuppgifter lagras och används för AI-träning.',
			colorClass: 'bg-red-500 shadow-red-500/40',
			iconPath:
				'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
		},
		{
			id: 'cg-4',
			title: 'Generella svar',
			desc: 'Opålitliga rättskällor. Advokaten måste manuellt verifiera allt.',
			colorClass: 'bg-red-600 shadow-red-600/50',
			iconPath:
				'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		},
	];

	veraJourney = [
		{
			id: 'v-1',
			title: 'Prompt med klientdata',
			desc: 'avslagsbeslut.pdf · 34 sidor',
			fileIconPath:
				'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			colorClass: 'bg-emerald-500 shadow-emerald-500/30',
			iconPath: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
		},
		{
			id: 'v-2',
			title: 'Data stannar hos er',
			desc: 'Processas lokalt. Lämnar aldrig byrån.',
			colorClass: 'bg-emerald-500 shadow-emerald-500/30',
			iconPath:
				'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		},
		{
			id: 'v-3',
			title: 'Tystnadsplikten intakt',
			desc: 'Ni styr var datan hamnar och vem har tillgång till det.',
			colorClass: 'bg-emerald-500 shadow-emerald-500/40',
			iconPath:
				'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
		},
		{
			id: 'v-4',
			title: 'Specialist på svensk rätt',
			desc: 'Strukturerat svar med verifierade lagrum, prejudikat och rekommenderad åtgärd.',
			colorClass: 'bg-emerald-400 shadow-emerald-400/50',
			iconPath:
				'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.168 18.477 18.832 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
		},
	];
	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		if (isPlatformBrowser(this.platformId)) {
			gsap.registerPlugin(ScrollTrigger);
		}
	}

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.initAnimations();
		}

		// Vänta lite tills resten av GSAP-animationerna (headers etc) är klara
		setTimeout(() => {
			this.introSwipe();
		}, 3000);
	}

	introSwipe() {
		const tl = gsap.timeline({
			defaults: { ease: 'power2.inOut' },
		});

		tl.to(this, {
			sliderPos: 85, // Svep åt höger (visa ChatGPT)
			duration: 0.8,
			onUpdate: () => {}, // Triggar change detection i vissa miljöer
		}).to(this, {
			sliderPos: 0, // Svep hela vägen till vänster (visa VERA)
			duration: 1.0,
		});
	}

	/* ── Slider interaction ── */

	onHandleDown(e: PointerEvent): void {
		e.preventDefault();
		e.stopPropagation();
		this.isDragging = true;
		(e.target as HTMLElement).closest('[style*="touch-action"]')?.setPointerCapture(e.pointerId);
	}

	onHandleMove(event: PointerEvent) {
		if (!this.isDragging) return;

		const rect = this.comparisonContainer.nativeElement.getBoundingClientRect();
		const x = event.clientX - rect.left;

		// Beräkna procent och tvinga den mellan exakt 0 och 100
		let pos = (x / rect.width) * 100;
		pos = Math.max(0, Math.min(100, pos));

		this.sliderPos = pos;
	}

	onHandleUp(e: PointerEvent): void {
		this.isDragging = false;
	}

	onContainerClick(e: PointerEvent): void {
		if (this.isDragging) return;
		this.updateSliderPos(e);
	}

	private updateSliderPos(e: PointerEvent): void {
		if (!this.comparisonContainer) return;
		const rect = this.comparisonContainer.nativeElement.getBoundingClientRect();
		const x = e.clientX - rect.left;
		this.sliderPos = Math.max(5, Math.min(95, (x / rect.width) * 100));
	}

	/* ── GSAP ── */

	private initAnimations(): void {
		gsap.to('.gsap-header', {
			opacity: 1,
			y: 0,
			duration: 1,
			delay: 0.2,
			ease: 'power3.out',
		});

		gsap.to('.gsap-comparison', {
			opacity: 1,
			duration: 0.6,
			delay: 0.8,
			ease: 'power2.out',
		});

		setTimeout(() => this.animateBothCards(), 1000);
	}

	private animateBothCards(): void {
		const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

		for (const prefix of ['cg', 'vera']) {
			const stepClass = `.${prefix}-step`;
			const lineH = `#line-${prefix}-h`;
			const lineV = `#line-${prefix}-v`;

			const tl = gsap.timeline();

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
		}
	}

	scrollTo(id: string, event: Event): void {
		event.preventDefault();
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}
}

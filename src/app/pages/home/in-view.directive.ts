import {
	Directive,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
	Inject,
	PLATFORM_ID,
	afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
	selector: '[appInView]',
	standalone: true,
})
export class InViewDirective implements OnInit, OnDestroy {
	@Input('appInViewDelay') delay = 0;
	@Input('appInViewOnce') once = true;

	private observer?: IntersectionObserver;
	private hasShown = false;

	constructor(
		private el: ElementRef<HTMLElement>,
		private r: Renderer2,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		// Run DOM/IO code only on the client, after the first render/hydration.
		afterNextRender(() => {
			if (!isPlatformBrowser(this.platformId)) return;
			if (typeof window === 'undefined' || !('IntersectionObserver' in window))
				return;

			const node = this.el.nativeElement;

			this.observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && (!this.hasShown || !this.once)) {
							const show = () => {
								this.r.removeClass(node, 'opacity-0');
								this.r.removeClass(node, 'translate-y-5');
								this.r.addClass(node, 'opacity-100');
								this.r.addClass(node, 'translate-y-0');
								this.hasShown = true;
								if (this.once && this.observer) this.observer.unobserve(node);
							};
							if (this.delay > 0) setTimeout(show, this.delay);
							else show();
						}
					});
				},
				{ threshold: 0.15 }
			);

			this.observer.observe(node);
		});
	}

	ngOnInit(): void {
		const node = this.el.nativeElement;

		// Initial state (safe to run on server too)
		this.r.addClass(node, 'opacity-0');
		this.r.addClass(node, 'translate-y-5');
		this.r.addClass(node, 'transition');
		this.r.addClass(node, 'duration-700');
		this.r.addClass(node, 'ease-out');
		this.r.addClass(node, '[transform:translate3d(0,0,0)]'); // helps some browsers
	}

	ngOnDestroy(): void {
		this.observer?.disconnect();
	}
}

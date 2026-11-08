import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SiteFooterComponent } from './shared/site-footer.component';
import { VisitService } from './services/visit/visit.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, CommonModule, SiteFooterComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'catsoio';

	/** Produktsidorna har egna sidfötter men inga länkar till resten av sajten; de får den gemensamma. */
	readonly showFooter = signal(false);

	constructor() {
		inject(VisitService).init();
		const router = inject(Router);
		router.events
			.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
			.subscribe(() => {
				let route = router.routerState.snapshot.root;
				while (route.firstChild) route = route.firstChild;
				this.showFooter.set(route.data['footer'] === true);
			});
	}
}

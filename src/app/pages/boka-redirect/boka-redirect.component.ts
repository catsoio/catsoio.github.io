import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * catso.io/verkstad/<adress>/bokning: verkstadens bokningssida bor i Axle-appen. Den här adressen är
 * den snygga länken att dela i annonser och på hemsidor; kunden skickas vidare till appen.
 */
@Component({
	selector: 'app-boka-redirect',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p style="font-family: system-ui, sans-serif; text-align: center; margin: 4rem 1rem; color: #374151">
			Öppnar bokningssidan… <a [href]="target">Klicka här om inget händer.</a>
		</p>
	`,
})
export class BokaRedirectComponent implements OnInit {
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('slug') ?? '';

	/** Bokningssidan i appen. */
	readonly target = `${environment.axleAppUrl}/boka/${encodeURIComponent(this.slug)}`;

	ngOnInit(): void {
		// Bara i webbläsaren: på servern finns ingen sida att skicka vidare.
		if (this.browser) window.location.replace(this.target);
	}
}

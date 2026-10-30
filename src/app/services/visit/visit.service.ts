import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, isDevMode } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Berättar för backend att någon besöker sidan (en gång per flik och session).
 * Backend sparar plats och sida, aldrig IP, och mejlar ägaren. Skickas inte vid
 * utveckling eller serverrendering.
 */
@Injectable({ providedIn: 'root' })
export class VisitService {
	private readonly router = inject(Router);
	private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	init(): void {
		if (!this.isBrowser || isDevMode()) return;
		try {
			if (sessionStorage.getItem('catso.visit')) return;
			sessionStorage.setItem('catso.visit', '1');
		} catch {
			// Utan sessionStorage skickas det en gång per sidladdning, backend sorterar ändå dubbletter.
		}
		this.router.events
			.pipe(
				filter((e): e is NavigationEnd => e instanceof NavigationEnd),
				take(1)
			)
			.subscribe((e) => {
				fetch(`${environment.apiBaseUrl}/contact/visit`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						path: e.urlAfterRedirects.slice(0, 200),
						site: location.hostname,
						referrer: document.referrer.slice(0, 300) || undefined,
					}),
					keepalive: true,
				}).catch(() => undefined);
			});
	}
}

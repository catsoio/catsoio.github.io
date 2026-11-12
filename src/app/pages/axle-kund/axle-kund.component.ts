import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MODULER } from '../axle-modul/axle-moduler.data';
import { KUNDER, kundBySlug, type Kund } from './axle-kunder.data';

/** Kundens egen berättelse, /axle/kunder/<slug>. Innehållet ligger i axle-kunder.data.ts. */
@Component({
	selector: 'app-axle-kund',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: './axle-kund.component.html',
	styleUrl: './axle-kund.component.scss',
})
export class AxleKundComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);

	readonly product = 'Catso Axle';
	readonly moduler = MODULER;
	readonly currentYear = new Date().getFullYear();
	readonly kund: Kund | undefined = this.pick();
	readonly fler: Kund[] = KUNDER.filter((k) => k.slug !== this.kund?.slug && (k.published || isDevMode())).slice(0, 2);

	private pick(): Kund | undefined {
		const k = kundBySlug(this.route.snapshot.data['kund']);
		if (!k || (!k.published && !isDevMode())) {
			void this.router.navigateByUrl('/apps/axle');
			return undefined;
		}
		return k;
	}
}

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MODULER, modulBySlug, type Modul } from './axle-moduler.data';

/** Produktnamnet står på samma sätt som på sidan /apps/axle. */
const PRODUCT_NAME = 'Catso Axle';

/**
 * En sida per del av Axle (däckhotell, tidsbokning, offert, lager, arbetsorder). Innehållet ligger i
 * axle-moduler.data.ts och vilken sida som visas styrs av `modul` i ruttens data.
 */
@Component({
	selector: 'app-axle-modul',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgTemplateOutlet],
	templateUrl: './axle-modul.component.html',
	styleUrl: './axle-modul.component.scss',
})
export class AxleModulComponent {
	private readonly route = inject(ActivatedRoute);

	readonly product = PRODUCT_NAME;
	readonly currentYear = new Date().getFullYear();
	readonly modul: Modul = modulBySlug(this.route.snapshot.data['modul']) ?? MODULER[0];
	readonly related: Modul[] = this.modul.related
		.map((slug) => modulBySlug(slug))
		.filter((m): m is Modul => !!m);
}

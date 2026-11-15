import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { type ShopProduct } from './axle-butik.api';
import { kr } from './axle-butik.logic';
import { ButikFrameComponent } from './butik-frame.component';
import { ButikVisualComponent } from './butik-visual.component';
import { ButikStore } from './butik.store';

export const CATEGORY_LABEL: Record<ShopProduct['category'], string> = {
	printer: 'Skrivare',
	supplies: 'Förbrukning',
	scanner: 'Skanners',
	terminal: 'Betalterminaler',
	other: 'Övrigt',
};

/**
 * Butikens startsida: varorna som kort med bild, pris och köpknapp. Kategorierna filtrerar,
 * ett kort leder till varans egen sida och varukorgen ligger i sidhuvudet.
 */
@Component({
	selector: 'app-axle-butik',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ButikFrameComponent, ButikVisualComponent],
	templateUrl: './axle-butik.component.html',
	styleUrl: './axle-butik.component.scss',
})
export class AxleButikComponent {
	readonly store = inject(ButikStore);
	readonly canceled = !!inject(ActivatedRoute).snapshot.queryParamMap.get('avbruten');
	readonly kr = kr;
	readonly label = CATEGORY_LABEL;

	readonly category = signal<ShopProduct['category'] | 'all'>('all');
	/** Kategorierna som finns bland varorna, i fast ordning. */
	readonly categories = computed(() => {
		const have = new Set(this.store.products().map((p) => p.category));
		return (Object.keys(CATEGORY_LABEL) as ShopProduct['category'][]).filter((c) => have.has(c));
	});
	/** Erbjudandet som lyfts i hero: ett startpaket om butiken har ett. */
	readonly featured = computed(() => this.store.products().find((p) => /startpaket/i.test(p.name)));
	readonly shown = computed(() =>
		this.category() === 'all' ? this.store.products() : this.store.products().filter((p) => p.category === this.category()),
	);
}

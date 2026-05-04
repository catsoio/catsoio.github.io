import { Component, inject } from '@angular/core';
import { Vera01UiService } from '../../../vera-01.ui.service';

@Component({
	selector: 'app-vera-01-footer',
	imports: [],
	templateUrl: './vera-01-footer.html',
	styleUrl: './vera-01-footer.scss',
})
export class Vera01Footer {
	public ui = inject(Vera01UiService);
}

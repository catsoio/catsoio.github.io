import { Component, inject } from '@angular/core';
import { Vera01UiService } from '../../../vera-01.ui.service';

@Component({
	selector: 'app-vera-01-navbar',
	imports: [],
	templateUrl: './vera-01-navbar.html',
	styleUrl: './vera-01-navbar.scss',
})
export class Vera01Navbar {
	public ui = inject(Vera01UiService);
}

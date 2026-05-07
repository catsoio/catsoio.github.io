import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Vera01Hero } from './vera-01-hero/vera-01-hero';
import { Vera01Banner } from './vera-01-banner/vera-01-banner';
import { Vera01Workspaces } from './vera-01-workspaces/vera-01-workspaces';
import { Vera01Table } from './vera-01-table/vera-01-table';
import { Vera01Faq } from './vera-01-faq/vera-01-faq';
import { Vera01Contact } from './vera-01-contact/vera-01-contact';
import { Vera01Navbar } from './vera-01-navbar/vera-01-navbar';
import { Vera01Footer } from './vera-01-footer/vera-01-footer';
import { Vera01UiService } from '../../vera-01.ui.service';
import { Vera01Showcase } from './vera-01-showcase/vera-01-showcase';

@Component({
	selector: 'app-vera-01',
	imports: [
		CommonModule,
		Vera01Navbar,
		Vera01Hero,
		Vera01Banner,
		Vera01Workspaces,
		Vera01Table,
		Vera01Faq,
		Vera01Contact,
		Vera01Footer,
		Vera01Showcase,
	],
	templateUrl: './vera-01.html',
	styleUrl: './vera-01.scss',
})
export class Vera01 {
	public ui = inject(Vera01UiService);

	openFaqIndex = signal<number | null>(null);
	scrolled = signal(false);
	mobileMenuOpen = signal(false);
}

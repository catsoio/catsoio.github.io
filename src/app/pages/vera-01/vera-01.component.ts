import {
	Component,
	computed,
	EventEmitter,
	Output,
	signal,
} from '@angular/core';
import { BookADemoComponent } from './book-a-demo/book-a-demo.component';
import { FooterComponent } from './footer/footer.component';
import { HowVeraThinkComponent } from './how-vera-think/how-vera-think.component';
import { HowVeraWorksComponent } from './how-vera-works/how-vera-works.component';
import { WhyLocalAgentComponent } from './why-local-agent/why-local-agent.component';
import { NavComponent } from './nav/nav.component';
import { TopBannerComponent } from './top-banner/top-banner.component';
import { HeroComponent } from './hero/hero.component';
import { TrustedByComponent } from './trusted-by/trusted-by.component';
import { FaqComponent } from './faq/faq.component';
import { ModellWorkspacesComponent } from './modell-workspaces/modell-workspaces.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpertAreasComponent } from './expert-areas/expert-areas.component';


@Component({
	selector: 'app-vera-01',
	standalone: true,
	imports: [
		BookADemoComponent,
		FooterComponent,
		HowVeraThinkComponent,
		HowVeraWorksComponent,
		WhyLocalAgentComponent,
		HeroComponent,
		TopBannerComponent,
		NavComponent,
		TrustedByComponent,
		FaqComponent,
		ModellWorkspacesComponent,
		CommonModule,
		FormsModule,
		ExpertAreasComponent,
	],
	templateUrl: './vera-01.component.html',
	styleUrl: './vera-01.component.scss',
})
export class Vera01Component {}

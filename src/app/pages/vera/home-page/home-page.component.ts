import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from '../hero/hero.component';
import { WhyLocalAiComponent } from '../why-local-ai/why-local-ai.component';
import { AboutComponent } from '../about/about.component';
import { PriceListComponent } from '../price-list/price-list.component';
import { BookDemoComponent } from '../book-demo/book-demo.component';
import { ContactComponent } from '../contact/contact.component';
import { FooterComponent } from '../footer/footer.component';
import { AiBusinessComponent } from '../ai-business/ai-business.component';
import { FaqComponent } from '../faq/faq.component';
import { CommonModule } from '@angular/common';
import { AiPromptDemoComponent } from "../ai-prompt-demo/ai-prompt-demo.component";
import { DocumentReviewComponent } from "../document-review/document-review.component";
import { PipeExplainComponent } from "../pipe-explain/pipe-explain.component";

@Component({
   selector: 'app-home-page',
   standalone: true,
   imports: [
    CommonModule,
    NavComponent,
    HeroComponent,
    WhyLocalAiComponent,
    AboutComponent,
    PriceListComponent,
    BookDemoComponent,
    ContactComponent,
    FooterComponent,
    AiBusinessComponent,
    FaqComponent,
    AiPromptDemoComponent,
    DocumentReviewComponent,
    PipeExplainComponent
],
   templateUrl: './home-page.component.html',
   styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}

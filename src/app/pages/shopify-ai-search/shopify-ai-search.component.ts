import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  body: string;
}

interface Step {
  title: string;
  body: string;
}

interface Plan {
  name: string;
  monthly: string;
  yearly: string;
  included: string;
  overage: string;
  products: string;
  featured: boolean;
}

interface Faq {
  q: string;
  a: string;
}

/**
 * Public marketing + policy page for the Catso AI Sök Shopify app.
 * Monochrome (black & white) to match the product. Swedish copy.
 * Route: /shopify/ai-search
 */
@Component({
  selector: 'app-shopify-ai-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopify-ai-search.component.html',
  styleUrl: './shopify-ai-search.component.scss',
})
export class ShopifyAiSearchComponent {
  readonly currentYear = new Date().getFullYear();
  readonly supportEmail = 'support@catso.io';

  readonly features: Feature[] = [
    {
      icon: '⌕',
      title: 'Semantisk sökning',
      body: 'Förstår vad kunden menar, inte bara exakta ord. "ny samsung sladd" hittar USB-C-kabeln även utan ordet "kabel".',
    },
    {
      icon: '✦',
      title: 'AI-shoppingassistent',
      body: 'En chattassistent som svarar kunden och bara rekommenderar produkter du faktiskt har i butiken.',
    },
    {
      icon: '≡',
      title: 'Smarta filter',
      body: 'Pris, tillgänglighet och egenskaper tolkas direkt ur naturligt språk — "laddare under 100 kr".',
    },
    {
      icon: '⇄',
      title: 'Svenska & engelska',
      body: 'Blandade kataloger fungerar: svensk beskrivning, engelsk sökning och tvärtom.',
    },
    {
      icon: '↻',
      title: 'Automatisk indexering',
      body: 'Nya och ändrade produkter synkas automatiskt via webhooks. Ingen manuell hantering.',
    },
    {
      icon: '⛉',
      title: 'Isolerat per butik',
      body: 'Varje butiks katalog ligger i en egen avgränsad partition. Din data hålls separat.',
    },
  ];

  readonly steps: Step[] = [
    {
      title: 'Synka katalogen',
      body: 'Installera appen och indexera dina produkter med ett klick.',
    },
    {
      title: 'Aktivera i temat',
      body: 'Slå på appinbäddningen i temaredigeraren — sökruta och assistent dyker upp.',
    },
    {
      title: 'Kunderna hittar rätt',
      body: 'Besökarna söker naturligt och hittar produkterna snabbare. Du är live.',
    },
  ];

  readonly plans: Plan[] = [
    {
      name: 'Starter',
      monthly: '$19',
      yearly: '$199 / år',
      included: '5 000 AI-sökningar / mån',
      overage: 'sedan $5 / 1 000',
      products: '~1 000 produkter',
      featured: false,
    },
    {
      name: 'Growth',
      monthly: '$49',
      yearly: '$499 / år',
      included: '25 000 AI-sökningar / mån',
      overage: 'sedan $4 / 1 000',
      products: '~10 000 produkter',
      featured: true,
    },
    {
      name: 'Pro',
      monthly: '$99',
      yearly: '$999 / år',
      included: '100 000 AI-sökningar / mån',
      overage: 'sedan $3 / 1 000',
      products: 'Obegränsat antal produkter',
      featured: false,
    },
  ];

  readonly faqs: Faq[] = [
    {
      q: 'Hur lång tid tar installationen?',
      a: 'Några minuter. Installera appen, synka katalogen och aktivera appinbäddningen i temat — sedan är du igång.',
    },
    {
      q: 'Vilka språk stöds?',
      a: 'Svenska och engelska, inklusive blandade kataloger och sökningar på olika språk.',
    },
    {
      q: 'Påverkar det butikens hastighet?',
      a: 'Nej. Sökningen körs på vår tjänst och laddas som ett lätt överlägg. Butikens tema påverkas minimalt.',
    },
    {
      q: 'Kan jag testa gratis?',
      a: 'Ja, alla planer har 14 dagars kostnadsfri provperiod. Du kan avsluta när som helst.',
    },
  ];
}

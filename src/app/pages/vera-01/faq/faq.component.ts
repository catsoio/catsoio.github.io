import { Component } from '@angular/core';

type FaqItem = { q: string; a: string };

@Component({
   selector: 'app-faq',
   standalone: true,
   imports: [],
   templateUrl: './faq.component.html',
   styleUrl: './faq.component.scss',
})
export class FaqComponent {
   introTitle = 'Vanliga Frågor.';
   introText = '';

   highlights: string[] = [];

   faqs: FaqItem[] = [
      {
         q: 'Lämnar datan vår miljö?',
         a: 'Nej. VERA-01 körs lokalt hos er och använder inga externa molntjänster. Frågor, dokument och svar stannar i er miljö.',
      },
      {
         q: 'Fungerar VERA-01 utan internet?',
         a: 'Ja. Den är byggd för att fungera även offline, med låg latens och utan molnberoenden.',
      },
      {
         q: 'Vad skiljer VERA-01 från t.ex. ChatGPT?',
         a: 'VERA-01 är en lokal AI-agent konstruerad och tränad på svensk lag, med spårbarhet till rättskällor. ChatGPT är en generell modell; VERA-01 är byggd för juridiskt arbete där källor, spårbarhet och kontroll över data är centralt.',
      },
      {
         q: 'Kan vi skräddarsy vilka moduler vi får tillgång till?',
         a: 'Ja. Ni väljer de som är relevanta för er byrå och kan även välja en “full byråsuite”.',
      },
      {
         q: 'Får alla på byrån tillgång till VERA-01?',
         a: 'Ja. Ett firmakonto kan omfatta hela byrån. Ni styr roller och behörigheter per team, klient och ärende.',
      },
      {
         q: 'Hur fungerar källhänvisningar?',
         a: 'Varje svar innehåller tydliga hänvisningar till relevanta svenska rättskällor, lagrum med kapitel/paragraf och praxis där det är relevant så att resonemanget går att kontrollera och återanvända.',
      },
   ];
}

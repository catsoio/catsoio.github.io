import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
   selector: 'app-faq',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './faq.component.html',
   styleUrl: './faq.component.scss',
})
export class FaqComponent {
   openIndex: number | null = null;

   faqs = [
      {
         question: 'Vad innebär ett AI-agent-projekt?',
         answer:
            'AI-agenter är digitala medarbetare som förstår uppgifter, kan fatta beslut och utföra dem autonomt, utan att behöva följas steg för steg. De fungerar som självständiga verktyg, inte bara chatbots eller enklare automation.',
      },
      {
         question: 'Ska AI-agenter behandlas som riktiga anställda?',
         answer:
            'Nej. AI-agenter behöver tydliga instruktioner, rutiner och kontroll över sitt arbete – inte som människor, men med struktur som liknar ett träningsschema. De kräver inte lön eller raster, men behöver övervakning för att leverera konsekvent kvalitet.',
      },
      {
         question: 'Måste vi dokumentera våra arbetsprocesser?',
         answer:
            'Absolut – AI-agenter behöver välstrukturerade processer (SOPs) att följa, för att undvika fel och tolkningar. Saknas detta, blir agentens output osäker och mindre pålitlig.',
      },
      {
         question: 'Är det värt att anlita en AI-byrå istället för att göra allt själv?',
         answer:
            'I de flesta fall: ja. De erbjuder teknisk expertis, integrationslösningar och kontinuerlig optimering – ofta blir ett partnerskap snabbare, kostnadseffektivare och mer robust än att försöka lösa allt internt.',
      },
      {
         question: 'Hur identifierar vi vilken agent vi behöver?',
         answer:
            'Börja med att analysera er verksamhet: Vad tar tid? Vilka manuella fel upprepas? Vilka moment är trötta och upprepade? En AI-byrå hjälper er hitta den bästa användningen – den agent som skapar verkligt värde.',
      },
      {
         question: 'Bör vi börja med många agent-projekt på en gång?',
         answer:
            'Nej – mindre är ofta mer. En välgenomtänkt, välbyggd agent ger större effekt än flera halvklara varianter. Börja smått, mät resultat, och bygg vidare utifrån feedback och lärdomar.',
      },
      {
         question: 'Räcker data, eller behöver vi annat?',
         answer:
            'Data är basen, men agenten måste också vara kopplad till system för att kunna agera – t.ex. CRM, e-post, databaser etc. En agent utan integrationsmöjligheter blir värdelös.',
      },
      {
         question: 'Hur viktigt är prompt-ingenjörskap?',
         answer:
            'Mycket. Rätt instruktioner (prompter) gör att agenten levererar exakt det ni förväntar er – undviker hallucinationer och felaktigheter. Iteration och testning är nyckeln.',
      },
      {
         question: 'Vad känner AI-byråer till om pris och support?',
         answer:
            'Mindre AI-agentprojekt brukar kosta: 2 000–6 000 USD/månad. Mer avancerade lösningar: 6 000–20 000 USD/månad. Enterprise-projekt kan kosta över: 20 000–50 000 USD/månad. I Sverige kan motsvarande ligga på ca 30 000–500 000 SEK beroende på komplexitet och supportnivå.',
      },
   ];

   toggleFAQ(i: number) {
      this.openIndex = this.openIndex === i ? null : i;
   }
}

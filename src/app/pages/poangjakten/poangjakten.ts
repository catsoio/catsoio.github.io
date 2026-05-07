import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoBookingService } from '../../services/vera01/demo-booking.service';

@Component({
   selector: 'app-poangjakten',
   standalone: true,
   imports: [CommonModule, FormsModule],
   templateUrl: './poangjakten.html',
   styles: [
      `
         .font-display {
            font-family: 'Space Grotesk', system-ui, sans-serif;
            letter-spacing: -0.02em;
         }
         .grid-bg {
            background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0);
            background-size: 24px 24px;
         }
      `,
   ],
})
export class Poangjakten {
   private demoService = inject(DemoBookingService);

   openFaq = signal<number | null>(0);

   sponsorSubmitting = false;
   sponsorSubmitSuccess = false;
   sponsorSubmitError = false;

   sponsorForm = {
      name: '',
      company: '',
      email: '',
      phone: '',
      package: '',
      message: '',
   };

   async submitSponsor(): Promise<void> {
      if (!this.sponsorForm.name || !this.sponsorForm.email || !this.sponsorForm.company) return;
      this.sponsorSubmitting = true;
      this.sponsorSubmitError = false;

      const message = [
         `[Poängjakten Sponsorförfrågan]`,
         `Företag: ${this.sponsorForm.company}`,
         this.sponsorForm.phone ? `Telefon: ${this.sponsorForm.phone}` : '',
         this.sponsorForm.package ? `Paket: ${this.sponsorForm.package}` : '',
         this.sponsorForm.message ? `Meddelande: ${this.sponsorForm.message}` : '',
      ]
         .filter(Boolean)
         .join('\n');

      try {
         await this.demoService.contactUsRequest({
            name: this.sponsorForm.name,
            email: this.sponsorForm.email,
            byra: this.sponsorForm.company,
            message,
            date: new Date().toISOString(),
         });
         this.sponsorSubmitSuccess = true;
         this.sponsorForm = { name: '', company: '', email: '', phone: '', package: '', message: '' };
      } catch {
         this.sponsorSubmitError = true;
      } finally {
         this.sponsorSubmitting = false;
      }
   }

   toggleFaq(i: number): void {
      this.openFaq.set(this.openFaq() === i ? null : i);
   }

   scrollTo(id: string): void {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   }

   zones = [
      {
         type: 'Hero-exponering',
         title: 'Presenting Partner',
         desc: 'Er logga och ert budskap ligger statiskt på startsidan (Challenge-vyn) som varje elev ser när de kollar poängställningen flera gånger om dagen.',
         metric: 'Visningar (Impressions) vid varje inloggning',
      },
      {
         type: 'Spotlight-utmaning',
         title: 'Sponsrat Uppdrag',
         desc: 'Ni äger ett specifikt uppdrag i appen. Elever klickar in, läser instruktionerna, utför uppdraget fysiskt, och skickar in beviset (videolänk).',
         metric: 'Antal utförda uppdrag + organisk räckvidd på sociala medier',
      },
      {
         type: 'Direkt konvertering',
         title: 'Erbjudanden & Rabatter',
         desc: 'Direkt koppling till köp via appens erbjudandeflik. Ni kan dela ut unika engångskoder till elever som utfört ett visst uppdrag.',
         metric: 'Klick till webbplats / Använda rabattkoder (CPA)',
      },
   ];

   tiers = [
      {
         name: 'Spotlight Regional',
         price: '',
         reach: 'Lokalt (T.ex. Norrbotten, 5-10 skolor)',
         features: ['1 Skräddarsytt uppdrag i appen', 'Er logga inne i uppdragsvyn', 'Rätt till specifik hashtag', 'Månadsrapport på engagemang'],
         cta: 'Boka möte',
         highlight: false,
      },
      {
         name: 'Platinum Nationell',
         price: '',
         reach: 'Rikstäckande (Studenten 2026)',
         features: [
            'Presenting Partner på startsidan',
            'Obegränsat antal sponsrade uppdrag',
            'Förtur på utformning av uppdrag',
            'Real-tids dashboard med analytics',
            'Möjlighet till direkta rabattkoder',
         ],
         cta: 'Begär offert',
         highlight: true,
      },
      {
         name: 'Performance / Förmån',
         price: 'Revenue Share / CPA',
         reach: 'Erbjudandefliken',
         features: [
            'Placering i dedikerad erbjudandevy',
            'Spårbara klick och konverteringar',
            'Perfekt för e-handel eller lokala butiker',
            'Endast betalning för faktiskt värde',
         ],
         cta: 'Kontakta oss',
         highlight: false,
      },
   ];

   faqs = [
      {
         q: 'Hur vet ni att ni når 100 000+ studenter?',
         a: 'Enligt SCB går cirka 100 000 elever ut gymnasiet varje år i Sverige. Poängjakten är en av de mest utbredda inofficiella traditionerna under vårterminen. Vårt mål med lanseringen HT26 är att initialt digitalisera traditionen för de största skolorna nationellt, och därefter skala upp.',
      },
      {
         q: 'Kan vi själva skapa utmaningar?',
         a: 'Ja, det är hela poängen för Platinum/Regional-partners. Ni föreslår, vi och skolkommittén godkänner (så det är lagligt och lämpligt), sedan är det live. Det är dock alltid skolkommittén som har sista ordet kring vad som publiceras för deras skola.',
      },
      {
         q: 'Vad gäller kring GDPR och åldersgränser?',
         a: 'Appen är strikt "Privacy by Design". Eleverna är 16–19 år. För användare under 18 år krävs vårdnadshavares samtycke vid registrering, vilket vi löser tekniskt. Ni som sponsor rör aldrig elevdata direkt — ni får endast aggregerad statistik och mätvärden.',
      },
      {
         q: 'Kan vi testa lokalt innan vi gör en rikstäckande kampanj?',
         a: 'Absolut, det är vår rekommendation! Starta med 5-10 skolor i en specifik region (Spotlight-paketet), mät engagemanget och konverteringen, och skala sedan upp samarbetet nationellt året därpå.',
      },
   ];

   // === Lägg till i landing.component.ts klassen, bredvid övriga properties ===

   year = new Date().getFullYear();

   timeline = [
      { date: 'Maj 2026', text: 'Partner-onboarding pågår. Vi tar in ett fåtal huvudvarumärken inför läsåret.' },
      { date: 'Aug 2026', text: 'Skolor onboardas. Appen lanseras till första kullen vid skolstart HT26.' },
      { date: 'Feb 2027', text: 'Den nationella studentjakten startar inför studenten 2027.' },
      { date: 'Jun 2027', text: 'Final, prisutdelning och sponsor-rapport levereras med engagement-, räckvidd- och CTR-data.' },
   ];
}

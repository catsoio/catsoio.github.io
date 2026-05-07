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
         type: 'Nivå 1: Hela Sverige',
         title: 'Nationell Sponsor',
         desc: 'Ni sponsrar själva huvudtävlingen ("Studenten 2026"). Ert varumärke och era uppdrag syns för varenda elev, i varenda skola, i hela landet. Oavsett om de bor i Luleå eller Malmö så utför de era utmaningar.',
         metric: 'Räckvidd: 100 000+ elever nationellt',
      },
      {
         type: 'Nivå 2: Region / Län',
         title: 'Regional Partner',
         desc: 'Välj en specifik region (t.ex. Skåne eller Norrbotten). Era sponsrade uppdrag dyker automatiskt upp för alla kommuner, skolor och elever som tillhör den regionen. Perfekt för regionala aktörer.',
         metric: 'Räckvidd: Alla skolor i vald region',
      },
      {
         type: 'Nivå 3: Kommun / Skola',
         title: 'Lokal Partner',
         desc: 'Rikta er mot en specifik kommun eller till och med en enskild skola. Perfekt för att driva fottrafik till en lokal butik. Eleven ser ert uppdrag tillsammans med de regionala och nationella uppdragen.',
         metric: 'Räckvidd: Specifik kommun eller skola',
      },
   ];

   tiers = [
      {
         name: 'Lokal / Kommun',
         price: 'Från 15 000 kr',
         reach: 'Riktat mot 1-5 lokala skolor',
         features: [
            '1 Lokalt skräddarsytt uppdrag',
            'Syns för alla elever i utvald kommun/skola',
            'Möjlighet att erbjuda lokal rabattkod',
            'Rapport på lokalt engagemang',
         ],
         cta: 'Boka lokalt paket',
         highlight: false,
      },
      {
         name: 'Regional (Län)',
         price: 'Från 60 000 kr',
         reach: 'Alla skolor i vald region (t.ex. Skåne)',
         features: [
            'Upp till 3 regionala uppdrag i appen',
            'Logga exponerad i hela regionens flöde',
            'Rätt till specifik hashtag för regionen',
            'Detaljerad rapport på regional viralitet',
         ],
         cta: 'Boka regionalt paket',
         highlight: true,
      },
      {
         name: 'Nationell Huvudsponsor',
         price: 'Offert',
         reach: 'Rikstäckande (Studenten 2026)',
         features: [
            'Presenting Partner på appens startsida',
            'Obegränsat antal nationella uppdrag',
            'Förtur på utformning av uppdrag',
            'Tillgång till real-tids dashboard över hela Sverige',
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
         a: 'Appen är strikt "Privacy by Design". Eleverna är 16–19 år. För användare under 18 år krävs vårdnadshavares samtycke vid registrering, vilket vi löser tekniskt. Ni som sponsor rör aldrig elevdata direkt. Ni får endast aggregerad statistik och mätvärden.',
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

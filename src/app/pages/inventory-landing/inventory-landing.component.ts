import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type PlanId = 'dack' | 'verkstad';
type TabId = 'artiklar' | 'dackhotell' | 'tidsbokning' | 'arbetsorder';

interface Plan {
	id: PlanId;
	name: string;
	price: number;
	includedUsers: number;
	audience: string;
	features: string[];
}

interface Tab {
	id: TabId;
	label: string;
	plan: string;
	headline: string;
	text: string;
	points: string[];
}

/** Priser exkl. moms. Håll i synk med backendens billing/domain/plans.ts. */
const EXTRA_USER_PRICE = 99;

@Component({
	selector: 'app-inventory-landing',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterLink],
	templateUrl: './inventory-landing.component.html',
	styleUrl: './inventory-landing.component.scss',
})
export class InventoryLandingComponent {
	readonly currentYear = new Date().getFullYear();
	readonly appUrl = '/inv/';
	readonly extraUserPrice = EXTRA_USER_PRICE;

	readonly tabs: Tab[] = [
		{
			id: 'artiklar',
			label: 'Artiklar',
			plan: 'Ingår i Däck och Verkstad',
			headline: 'Full koll på lagret och marginalen',
			text: 'Däck, fälgar och delar på ett ställe, med inköpspris och försäljningspris på varje artikel.',
			points: [
				'Saldo uppdateras vid varje inköp, försäljning och retur',
				'Se vad du betalade och vad du tar, så du ser marginalen direkt',
				'Historik på varje artikel: vem tog ut vad och när',
				'Lagervarning när något håller på att ta slut',
			],
		},
		{
			id: 'dackhotell',
			label: 'Däckhotell',
			plan: 'Ingår i Däck och Verkstad',
			headline: 'Hitta kundens däck på sekunder',
			text: 'Registrera inlämning med regnummer, säsong och om däcken sitter på fälg. Ingen mer letande bland hyllorna.',
			points: [
				'Ny inlämning: regnr, märke, datum och säsongsdäck',
				'Däck med eller utan fälg, enskilt eller som hjulpaket',
				'Notera betalning direkt eller skicka fakturan senare',
				'Allt går att ändra i efterhand',
			],
		},
		{
			id: 'tidsbokning',
			label: 'Tidsbokning',
			plan: 'Ingår i Verkstad',
			headline: 'En kalender för hela verkstaden',
			text: 'Se vilka mekaniker och platser som är lediga och boka in bilen utan att ringa runt.',
			points: [
				'Kalender per mekaniker och plats',
				'Vad som ska göras, prisförslag och överenskommet pris',
				'Inlämningsdag och hämtningsdag på samma bokning',
				'Anmärkningar, till exempel rostig dragkrok eller återkommande taxibolag',
			],
		},
		{
			id: 'arbetsorder',
			label: 'Arbetsorder',
			plan: 'Ingår i Verkstad',
			headline: 'Skriv ut och lämna till mekanikern',
			text: 'Från bokning till färdig order. Mekanikern får ett tydligt papper, och delarna dras från lagret.',
			points: [
				'Skapa orden från en bokning med kund och bil förifyllda',
				'Utskrift för mekanikern med det som ska göras',
				'Delar och arbete på samma order',
				'Orden hamnar rätt i bokföringsunderlaget',
			],
		},
	];

	readonly plans: Plan[] = [
		{
			id: 'dack',
			name: 'Däck',
			price: 495,
			includedUsers: 2,
			audience: 'För däckfirmor och verkstäder som vill ha ordning på lagret.',
			features: [
				'Artiklar och lager',
				'Däckhotell',
				'Kunder och bilar med regnummer',
				'2 användare ingår',
			],
		},
		{
			id: 'verkstad',
			name: 'Verkstad',
			price: 1295,
			includedUsers: 5,
			audience: 'För verkstäder som vill ha hela flödet, från bokning till bokföring.',
			features: [
				'Allt i Däck',
				'Tidsbokning',
				'Arbetsorder med utskrift',
				'Bokföring och dagsavslut',
				'5 användare ingår',
			],
		},
	];

	readonly steps = [
		{ title: 'Skapa konto', text: 'Du får en startkod av oss, registrerar dig och lägger upp din verkstad. Inget kort behövs.' },
		{ title: 'Lägg in dina första däck och artiklar', text: 'Börja med det du har på hyllan idag. Resten fyller du på allt eftersom.' },
		{ title: 'Bjud in kollegorna', text: 'Skicka en engångskod till varje mekaniker. Klart på en minut.' },
	];

	readonly faqs = [
		{
			q: 'Vad händer efter de 14 dagarna?',
			a: 'Du väljer en plan eller avslutar. Vi ber inte om kortuppgifter förrän du själv vill fortsätta, och dina uppgifter finns kvar om du väljer plan.',
		},
		{
			q: 'Gäller priserna inklusive moms?',
			a: 'Alla priser är exklusive moms. Svensk moms (25 %) tillkommer på fakturan, så Däck blir 618,75 kr och Verkstad 1 618,75 kr per månad inklusive moms.',
		},
		{
			q: 'Hur räknas användare?',
			a: 'Däck inkluderar 2 användare och Verkstad 5, och det är ett fast tak. Ingen kan läggas till av misstag och kostnaden ändras aldrig av sig självt. Behöver ni fler hör ni av er, så lägger vi till användare för 99 kr per användare och månad exklusive moms.',
		},
		{
			q: 'Kan jag byta plan eller säga upp?',
			a: 'Ja, när som helst i kundportalen. Ingen bindningstid.',
		},
		{
			q: 'Vi kör allt på papper idag. Är det svårt att komma igång?',
			a: 'Nej. Du börjar med det viktigaste, till exempel däckhotellet, och bygger på därefter. Behöver du hjälp med att komma igång når du oss på support&#64;catso.io.',
		},
		{
			q: 'Fungerar det på mobil och surfplatta?',
			a: 'Ja, appen körs i webbläsaren och fungerar på dator, surfplatta och mobil.',
		},
	];

	readonly activeTab = signal<TabId>('dackhotell');
	readonly tab = computed(() => this.tabs.find((t) => t.id === this.activeTab()) ?? this.tabs[0]);

	readonly selectedPlan = signal<PlanId>('verkstad');
	readonly users = signal(3);

	readonly plan = computed(() => this.plans.find((p) => p.id === this.selectedPlan()) ?? this.plans[0]);
	readonly extraUsers = computed(() => Math.max(0, this.users() - this.plan().includedUsers));
	readonly total = computed(() => this.plan().price + this.extraUsers() * EXTRA_USER_PRICE);

	selectTab(id: TabId): void {
		this.activeTab.set(id);
	}

	selectPlan(id: PlanId): void {
		this.selectedPlan.set(id);
	}

	changeUsers(delta: number): void {
		this.users.update((n) => Math.min(50, Math.max(1, n + delta)));
	}
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Feature {
	id: string;
	kicker: string;
	title: string;
	text: string;
	points: string[];
	image: string;
	alt: string;
}

interface Plan {
	name: string;
	price: string;
	users: string;
	blurb: string;
	features: string[];
	highlight?: boolean;
}

const IMG = '/assets/imgs/dacklager';

@Component({
	selector: 'app-dacklager',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './dacklager.component.html',
})
export class DacklagerComponent {
	readonly img = IMG;
	readonly mail = 'mailto:support@catso.io?subject=Catso%20D%C3%A4cklager';
	readonly appUrl = '/inv';
	menuOpen = false;

	readonly features: Feature[] = [
		{
			id: 'lager',
			kicker: 'Lager',
			title: 'Full koll på lagret, varje däck och fälg',
			text: 'Se saldo i realtid och hitta rätt artikel på sekunder. Sök på storlek, märke, säsong eller hyllplats.',
			points: [
				'Lagersaldo och hyllplats per artikel',
				'Varning när något börjar ta slut',
				'Inköp, försäljning och inventering loggas automatiskt',
				'Marginal och lagervärde direkt i översikten',
			],
			image: `${IMG}/desktop-inventory.webp`,
			alt: 'Artikellistan i Catso Däcklager med däck, fälgar och lagersaldo',
		},
		{
			id: 'tidsbokning',
			kicker: 'Tidsbokning',
			title: 'En kalender för hela verkstaden',
			text: 'Boka in kunder per mekaniker eller plats och se dagen på en blick. Dra och släpp för att flytta en bokning.',
			points: [
				'Dag-, vecko- och månadsvy',
				'Färgkodade mekaniker och lyftar',
				'Åtgärder med färdig tid och prisuppgift',
				'Från bokning till arbetsorder med ett klick',
			],
			image: `${IMG}/desktop-bookings.webp`,
			alt: 'Veckokalendern i Catso Däcklager med bokningar per mekaniker',
		},
		{
			id: 'dackhotell',
			kicker: 'Däckhotell',
			title: 'Ordning på kundernas däck',
			text: 'Registrera inlagrade däck och hjul med plats, avgift och hämtdatum. Du ser direkt vad som är obetalt och vad som skulle ha hämtats.',
			points: [
				'Kopplat till kund och regnummer',
				'Obetalda och försenade uppdrag markeras',
				'Lagerplats och skick på varje set',
				'Utlämning och betalning med några tryck',
			],
			image: `${IMG}/desktop-storage.webp`,
			alt: 'Däckhotellets lista med inlagrade däck och hjul i Catso Däcklager',
		},
		{
			id: 'arbetsorder',
			kicker: 'Arbetsorder',
			title: 'Arbetsordern som mekanikern faktiskt använder',
			text: 'Samla arbete, delar och noteringar på ett ställe, så att mekanikern vet exakt vad som ska göras.',
			points: [
				'Arbete, delar och övrigt på samma order',
				'Status från öppen till klar',
				'Kopplad till kund, bil och bokning',
				'Pris och offert per order',
			],
			image: `${IMG}/desktop-workorder.webp`,
			alt: 'En arbetsorder med arbete, delar och summa i Catso Däcklager',
		},
	];

	readonly mobileShots = [
		{ src: `${IMG}/mobile-dashboard.webp`, alt: 'Startsidan i mobilen', label: 'Dagens läge' },
		{ src: `${IMG}/mobile-inventory.webp`, alt: 'Lagret i mobilen', label: 'Lagret' },
		{ src: `${IMG}/mobile-bookings.webp`, alt: 'Kalendern i mobilen', label: 'Bokningar' },
		{ src: `${IMG}/mobile-storage.webp`, alt: 'Däckhotellet i mobilen', label: 'Däckhotell' },
	];

	readonly platforms = [
		{ name: 'Dator', text: 'Hela överblicken på kontoret och i receptionen.' },
		{ name: 'Surfplatta', text: 'Smidigt vid disken och ute i verkstaden.' },
		{ name: 'Mobil', text: 'Slå upp saldo och bokningar var du än står.' },
	];

	readonly more = [
		{ title: 'Kunder och bilar', text: 'Ett register med kunder, bilar och anteckningar som följer med bilen.' },
		{ title: 'Behörigheter', text: 'Ägare ser allt. Personal får göra det de ska, men inte ändra inköpspriser eller bokföring.' },
		{ title: 'Rapporter', text: 'Försäljning, bruttovinst och inköp per period.' },
		{ title: 'Bokföring', text: 'Stäng perioden och få ett tydligt underlag.' },
		{ title: 'Leverantörer', text: 'Håll koll på vem ni köper av och vad ni köpt.' },
		{ title: 'Inbjudningar', text: 'Bjud in kollegor med en engångskod. Ni bestämmer vem som får vara med.' },
	];

	readonly plans: Plan[] = [
		{
			name: 'Däck',
			price: '495',
			users: '2 användare ingår',
			blurb: 'För dig som lagrar och säljer däck.',
			features: ['Lager och artiklar', 'Däckhotell', 'Kunder och bilar', 'Rapporter'],
		},
		{
			name: 'Verkstad',
			price: '1 295',
			users: '5 användare ingår',
			blurb: 'För hela verkstaden, från bokning till bokföring.',
			features: [
				'Allt i Däck',
				'Tidsbokning',
				'Arbetsorder',
				'Bokföring',
			],
			highlight: true,
		},
	];

	readonly faq = [
		{
			q: 'Måste jag installera något?',
			a: 'Nej. Catso Däcklager körs i webbläsaren på dator, surfplatta och mobil. Du loggar in och är igång.',
		},
		{
			q: 'Hur kommer jag igång?',
			a: 'Hör av dig så får du en inbjudningskod och hjälp att lägga upp garaget. Därefter bjuder du in dina kollegor själv.',
		},
		{
			q: 'Vad kostar det och vad ingår i provperioden?',
			a: 'Du provar hela Verkstad-planen i 14 dagar utan att betala. Därefter väljer du plan. Alla priser är per månad och exkl. moms. Fler användare kostar 99 kr per användare och månad.',
		},
		{
			q: 'Kan jag byta plan eller säga upp?',
			a: 'Ja. Du hanterar plan, betalsätt och uppsägning själv i kundportalen, när det passar dig.',
		},
		{
			q: 'Kan alla i verkstaden se allt?',
			a: 'Nej. Ägaren har full åtkomst. Personal kan arbeta med lager, bokningar och arbetsorder, men ser inte inköpspriser eller bokföring.',
		},
	];

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
	}
}

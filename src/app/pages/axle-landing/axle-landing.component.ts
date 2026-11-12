import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	inject,
	computed,
	isDevMode,
	signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MODULER } from '../axle-modul/axle-moduler.data';
import { firstValueFrom } from 'rxjs';
import { AXLE_FAQ } from '../../seo/faq.data';
import { KUNDER, type Kund } from '../axle-kund/axle-kunder.data';

interface Feature {
	id: string;
	title: string;
	text: string;
	points: string[];
	image: string;
	alt: string;
	phone?: string;
	phoneAlt?: string;
	/** Sidan med mer om delen: /axle/<to>. */
	to?: string;
	more?: string;
}

interface Plan {
	name: string;
	price: string;
	users: string;
	blurb: string;
	features: string[];
	highlight?: boolean;
}

interface Catalog {
	extraUserPriceMinor: number;
	plans: { id: string; name: string; blurb: string; features: string[]; priceMinor: number; includedUsers: number }[];
}

type FormState = 'idle' | 'sending' | 'sent' | 'error';

const MANUAL = '/assets/imgs/manual';
const PHOTO = '/assets/imgs/axle';

/** Produktnamnet står på ett ställe så det är lätt att byta. */
export const PRODUCT_NAME = 'Catso Axle';

@Component({
	selector: 'app-axle-landing',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterLink, ReactiveFormsModule],
	templateUrl: './axle-landing.component.html',
	styleUrl: './axle-landing.component.scss',
})
export class AxleLandingComponent implements OnInit, AfterViewInit, OnDestroy {
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private cleanup?: () => void;
	private readonly http = inject(HttpClient);
	private readonly fb = inject(FormBuilder);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

	readonly product = PRODUCT_NAME;
	readonly moduler = MODULER;
	readonly manual = MANUAL;
	readonly photo = PHOTO;
	/** Länk till själva appen. Tom tills adressen är bestämd, då döljs "Logga in". */
	readonly appUrl = '';
	readonly currentYear = new Date().getFullYear();
	readonly menuOpen = signal(false);

	readonly faqs = AXLE_FAQ;

	/** Lägg officiella logotyper i public/assets/imgs/axle/ och sätt `src`, annars visas namnet som text. */
	readonly partners: { name: string; src: string; h: string }[] = [
		{ name: 'Blocket', src: `${PHOTO}/partners/blocket.svg`, h: 'h-7' },
		{ name: 'Gummigrossen', src: `${PHOTO}/partners/gummigrossen.png`, h: 'h-10 logo-dark' },
	];

	readonly hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16'];
	/** Schemat i kortet: kolumn 2 = 08:00, varje kolumn är en timme. */
	readonly schedule = [
		{ name: 'Ali', tone: 'a', blocks: [{ s: 3, e: 5, l: 'NOR 330 · Service' }, { s: 7, e: 9, l: 'LIN 202 · Bromsar' }] },
		{ name: 'Jonas', tone: 'b', blocks: [{ s: 2, e: 4, l: 'YEL 125 · Däckbyte' }, { s: 8, e: 10, l: 'LSG 84Z · Hjulinställning' }] },
		{ name: 'Samir', tone: 'c', blocks: [{ s: 2, e: 5, l: 'HDP 18W · Oljebyte' }, { s: 6, e: 8, l: 'NEX 51C · AC-service' }] },
		{ name: 'Lyft 1', tone: 'd', blocks: [{ s: 4, e: 7, l: 'SBH 90L · Däckbyte' }] },
	];

	readonly sms = [
		{ namn: 'Andreas', regnr: 'CDR 24A' },
		{ namn: 'Anna', regnr: 'ZGU 55P' },
		{ namn: 'Annika', regnr: 'FPR 67N' },
	];

	readonly audience = [
		{ title: 'För däckfirmor', text: 'Se alla däckset, hyllor och hämtdatum på ett ställe, direkt på skärmen.', cta: 'Se däckhotellet', photo: `${PHOTO}/photos/hjul.jpg`, pos: 'center 40%', link: '/axle/dackhotell', fragment: undefined as string | undefined },
		{ title: 'För bilverkstäder', text: 'Boka in bilen, skicka offert till kunden och skriv arbetsordern.', cta: 'Se arbetsordern', photo: `${PHOTO}/photos/bilverkstad.jpg`, pos: 'center 40%', link: '/axle/arbetsorder', fragment: undefined as string | undefined },
		{ title: 'Säljer ni bilar också?', text: 'Lägg till bilhandeln direkt i samma system. Ni delar kunder och fakturor med verkstaden.', cta: 'Läs mer', photo: `${PHOTO}/photos/bilhandel.jpg`, pos: 'center 30%', link: '/hall', fragment: undefined as string | undefined },
	];

	/** Kundberättelser: publicerade (och i utvecklingsläge även utkast), se pages/axle-kund/axle-kunder.data.ts. */
	readonly kunder: Kund[] = KUNDER.filter((k) => k.published || isDevMode());
	/** Kundsektionen visas bara i dev-läget (med exempeltexter) tills det finns riktiga, godkända citat. Då: sätt till true. */
	readonly showKunder = false;
	/** Betyg under hjälten. Visas bara i dev-läget tills det finns ett riktigt betyg från riktiga omdömen. */
	readonly showRating = isDevMode();
	readonly rating = '4.9';
	readonly stars = [1, 2, 3, 4, 5];
	readonly kundIndex = signal(0);
	readonly current = computed(() => this.kunder[this.kundIndex()] ?? this.kunder[0]);

	step(d: number): void {
		const n = this.kunder.length;
		this.kundIndex.update((i) => (i + d + n) % n);
	}

	readonly features: Feature[] = [
		{
			id: 'tidsbokning',
			title: 'Boka in bilar med ett klick',
			text: 'Se alla mekaniker och lyft i samma vy, och klicka på en ledig tid.',
			points: [],
			image: `${PHOTO}/app-resurser.jpg`,
			alt: 'Tidsbokningen med en kolumn per mekaniker och lyft',
			to: 'tidsbokning',
			more: 'Läs mer om tidsbokningen',
		},
		{
			id: 'kalla-in',
			title: 'Kalla in kunder med SMS',
			text: 'Välj vilka som ska kallas in och skriv meddelandet en gång. Namn och registreringsnummer fylls i för varje kund, och SMS:et skickas till alla på en gång.',
			points: [],
			image: `${PHOTO}/app-kallain.jpg`,
			alt: 'Dialogen Kalla in kunder med SMS-text och mottagare',
		},
	];

	private readonly defaultPlans: Plan[] = [
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
			features: ['Allt i Däck', 'Bokningar', 'Arbetsorder', 'Bokföring'],
			highlight: true,
		},
	];

	/** Defaults until (or unless) the live catalog from the backend arrives. */
	readonly plans = signal<Plan[]>(this.defaultPlans);
	readonly extraUserPrice = signal('99');

	readonly form = this.fb.nonNullable.group({
		name: ['', [Validators.required, Validators.maxLength(120)]],
		workshop: ['', [Validators.maxLength(160)]],
		email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
		phone: ['', [Validators.maxLength(40)]],
		website: [''], // honeypot, ska förbli tom
	});
	readonly state = signal<FormState>('idle');
	readonly submitted = signal(false);

	private get apiBase(): string {
		return isDevMode() ? 'http://localhost:3000/api' : 'https://api.catso.io/api';
	}

	async ngOnInit(): Promise<void> {
		if (!this.browser) return;
		try {
			const res = await firstValueFrom(
				this.http.get<{ data: Catalog }>(`${this.apiBase}/inventory/plans`, {
					headers: new HttpHeaders({ 'X-App-Id': 'garagestock' }),
				}),
			);
			const fmt = (minor: number) => new Intl.NumberFormat('sv-SE').format(minor / 100);
			this.plans.set(
				res.data.plans.map((p) => ({
					name: p.name,
					price: fmt(p.priceMinor),
					users: `${p.includedUsers} användare ingår`,
					blurb: p.blurb,
					features: p.features,
					highlight: p.id === 'verkstad',
				})),
			);
			this.extraUserPrice.set(fmt(res.data.extraUserPriceMinor));
		} catch {
			// Behåller standardpriserna om katalogen inte kan hämtas.
		}
	}

	/** Parallax och inglidning vid scroll, bara på dator och om användaren inte valt minskad rörelse. */
	ngAfterViewInit(): void {
		if (!this.browser) return;
		const root = this.host.nativeElement;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const desktop = matchMedia('(min-width: 1024px)');
		if (reduce) return;

		const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
		reveals.forEach((el) => el.classList.add('reveal'));
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						e.target.classList.add('reveal-in');
						io.unobserve(e.target);
					}
				}
			},
			{ threshold: 0.12 },
		);
		reveals.forEach((el) => io.observe(el));

		const items = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
		let ticking = false;
		const update = () => {
			ticking = false;
			const vh = innerHeight;
			for (const el of items) {
				if (!desktop.matches) {
					el.style.transform = '';
					continue;
				}
				const speed = parseFloat(el.dataset['parallax'] ?? '0');
				const r = el.parentElement!.getBoundingClientRect();
				if (r.bottom < -200 || r.top > vh + 200) continue;
				const offset = (r.top + r.height / 2 - vh / 2) * speed * -1;
				el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
			}
		};
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(update);
			}
		};
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll, { passive: true });
		update();
		this.cleanup = () => {
			io.disconnect();
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
		};
	}

	ngOnDestroy(): void {
		this.cleanup?.();
	}

	/** Förifyller meddelandet när någon klickar på en plan i prislistan. */
	private chosenPlan = '';

	choosePlan(name: string): void {
		this.chosenPlan = name;
	}

	toggleMenu(): void {
		this.menuOpen.update((v) => !v);
	}

	async submit(): Promise<void> {
		this.submitted.set(true);
		if (this.form.invalid || this.state() === 'sending' || !this.browser) return;
		this.state.set('sending');
		try {
			await firstValueFrom(
				this.http.post(`${this.apiBase}/contact`, {
					...this.form.getRawValue(),
					product: this.product,
				}),
			);
			this.state.set('sent');
			this.form.reset();
			this.submitted.set(false);
		} catch {
			this.state.set('error');
		}
	}
}

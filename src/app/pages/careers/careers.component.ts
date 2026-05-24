import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	HostListener,
	inject,
	OnInit,
	signal,
	ViewChild,
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

interface FaqItem {
	question: string;
	answer: string;
	isOpen: boolean;
}
@Component({
	selector: 'app-careers',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './careers.component.html',
	styleUrls: ['./careers.component.scss'],
})
export class CareersComponent {
	private readonly fb = inject(FormBuilder);
	private readonly http = inject(HttpClient);

	// ───────── UI state ─────────
	readonly isMenuOpen = signal(false);
	readonly openFaqIndex = signal<number | null>(null);
	readonly activeSolutionTab = signal(0);
	readonly submissionState = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
	readonly currentYear = new Date().getFullYear();

	// ───────── Form ─────────
	readonly demoForm: FormGroup = this.fb.nonNullable.group({
		firmName: ['', [Validators.required, Validators.minLength(2)]],
		fullName: ['', [Validators.required, Validators.minLength(2)]],
		title: [''],
		email: ['', [Validators.required, Validators.email]],
		phone: ['', [Validators.required, Validators.minLength(6)]],
		firmSize: [''],
		message: [''],
		consent: [false, [Validators.requiredTrue]],
	});

	readonly isSubmitting = computed(() => this.submissionState() === 'submitting');

	// ───────── Three pillars (under hero) ─────────
	readonly pillars = [
		{
			label: 'Lokal arkitektur',
			title: 'Er data stannar hos er. Punkt.',
			body: 'VERA-01 sitter fysiskt på ert kontor. Det betyder att varje fråga, varje svar och varje klientuppgift behandlas i samma rum som era jurister. Ingenting skickas ut — varken till oss, till ett datacenter eller till någon annan.',
			cta: { label: 'Så fungerar arkitekturen', target: 'architecture' },
		},
		{
			label: 'Inget internetberoende',
			title: 'Fungerar även när nätet inte gör det',
			body: 'Eftersom allt körs lokalt finns inget molnkonto som kan gå ner, ingen uppkoppling som måste fungera, ingen extern part som kan stängas av eller byta villkor. Systemet är ert — oavsett vad som händer utanför.',
			cta: { label: 'Compliance-modellen', target: 'compliance' },
		},
		{
			label: 'Svensk juridik',
			title: 'Förstår era ärenden, inte bara lagar',
			body: 'VERA-01 arbetar med svensk lagstiftning, förarbeten och praxis — men också med era egna PM, mallar och gamla ärenden. Det är skillnaden mellan en generisk AI och ett verktyg som faktiskt vet hur ni jobbar.',
			cta: { label: 'Användningsområden', target: 'solutions' },
		},
	] as const;

	readonly stats = [
		{ value: '100', unit: '%', label: 'Lokalt' },
		{ value: '0', unit: '', label: 'API-anrop till tredje part' },
		{ value: '24/7', unit: '', label: 'Tillgänglig' },
	] as const;

	// ───────── Three forces shaping the moment ─────────
	readonly forces = [
		{
			tag: 'Yrkesetik',
			title: 'Samfundet säger ifrån',
			stat: 'Juni 2025',
			body: 'Advokatsamfundets vägledning (2025) kräver att klientinformation inte får användas för träning eller utdata till andra, att personuppgifter inte överförs till tredje land. Vi eliminerar samtliga risker genom att köra modellen lokalt hos er.',
			source: 'Sveriges advokatsamfund, 2025',
		},
		{
			tag: 'Kvalitet',
			title: 'AI som hittar på saker',
			stat: '600+ fall',
			body: 'Över 600 jurister sanktionerades globalt under 2025 för att deras AI-verktyg hittade på rättsfall som inte existerade. När ni kör AI lokalt mot era egna källor kan ni verifiera varje svar. Det är skillnaden mellan ett verktyg och ett lotteri.',
			source: 'Charlotin AI Hallucination Tracker, 2025',
		},
	] as const;

	// ───────── Practice areas (industries-style cards) ─────────
	readonly practiceAreas = [
		{
			title: 'M&A och transaktioner',
			body: 'Tabular due diligence, avtalsanalys i volym, datarum­indexering — utan att en enda handling lämnar lokalen.',
			image: '/assets/imgs/verawall.png',
		},
		{
			title: 'Compliance & regulatorisk',
			body: 'Sökning i interna ramverk, sanktions­bedömningar, mappning av nya regler mot byråns klientpolicy.',
			image: '/assets/vera/practice/compliance.jpg',
		},
		{
			title: 'Process & tvistlösning',
			body: 'Förundersöknings­protokoll, partsskrifter, vittnesförhör — sammanfattat och sökbart inom timmar.',
			image: '/assets/vera/practice/litigation.jpg',
		},
		{
			title: 'Bolagsrätt & styrelsearbete',
			body: 'Bolagsstämmoprotokoll, aktieägaravtal, styrelseinstruktioner — analyserat mot er praxis och svensk lag.',
			image: '/assets/vera/practice/corporate.jpg',
		},
		{
			title: 'Skatte- & finansjuridik',
			body: 'Skatteförarbeten, OECD-riktlinjer, EU-direktiv. VERA-01 hänvisar till källan vid varje slutsats.',
			image: '/assets/vera/practice/tax.jpg',
		},
		{
			title: 'Arbets- & anställningsrätt',
			body: 'Kollektivavtals­tolkning, MBL-frågor, anställnings­avtal. Hög volym, snabb genomgång, alltid spårbart.',
			image: '/assets/vera/practice/employment.jpg',
		},
	] as const;

	// ───────── Solutions (tabbed capabilities) ─────────
	readonly solutions = [
		{
			tab: 'Dokumentanalys',
			title: 'Sammanfatta +600 sidor på minuter.',
			body: 'FUP, förhör, domar, transaktionshandlingar och bilagor. VERA-01 läser in omfattande ärendematerial, kartlägger nyckelinformation och bygger en sökbar struktur. Extraherar exakt det ni söker.',
			bullets: [
				'Kronologisk tidslinje.',
				'Extraherar exakt de datapunkter ni efter frågar. Direkt i chatten.',
				'Exporterar till Word, Excel eller PDF',
			],
			image: '/assets/imgs/veramanydocs.png',
			bubble1: '',
			bubble2: '/assets/imgs/mormor4.png',
		},
		{
			tab: 'Avtalsgranskning',
			title: 'Hela datarummet — utan att det lämnar ert.',
			body: 'Istället för att ladda upp tusentals filer till en molntjänst kör VERA-01 extraktionen på plats. Ni får en strukturerad tabell med datapunkter ni faktiskt behöver — inte en AI-sammanfattning ni inte vågar lita på.',
			bullets: [
				'Extraherar exakt det ni söker ur varje dokument',
				'Flaggar risker med hänvisning till källa',
				'Exportera till Excel eller direkt in i era befintliga verktyg',
			],
			image: '/assets/imgs/verascanmulti.png',
			bubble1: '',
			bubble2: '',
		},
		{
			tab: 'Rättsutredning',
			title: 'Svar med källa — eller inget svar alls.',
			body: 'VERA-01 söker i svensk lag, förarbeten och praxis. Hittar systemet inte stöd för ett påstående säger det det, istället för att hitta på ett rättsfall som inte finns. Allt körs lokalt, så era sökningar är bara era.',
			bullets: [
				'Varje svar hänvisar till lagrum eller rättsfall',
				'Spårbart ner till enskilt stycke i förarbete',
				'Säger "jag vet inte" istället för att fabricera',
			],
			image: '/assets/vera/solutions/research.jpg',
			bubble1: '',
			bubble2: '',
		},
	] as const;

	// ───────── Three principles ─────────
	readonly principles = [
		{
			number: '01',
			title: 'Full kontroll över er data',
			lead: 'Ingen annan har tillgång. Inte ens vi.',
			body: 'Systemet står i ert serverrum. Det finns inget konto hos oss, ingen fjärråtkomst, inget sätt för någon utanför byrån att nå det. Det är samma princip som att ha akterna i ett låst skåp — fast för AI.',
		},
		{
			number: '02',
			title: 'Oberoende av internet',
			lead: 'Fungerar även om resten av världen inte gör det.',
			body: 'Lokal AI kräver ingen uppkoppling för att fungera. Ingen prenumeration som kan höjas. Ingen leverantör som kan byta villkor, stänga ner eller säljas till någon annan.',
		},
		{
			number: '03',
			title: 'Svar ni kan verifiera',
			lead: 'Inget påstående utan källa.',
			body: 'Varje svar pekar tillbaka till ett lagrum, ett rättsfall eller ett dokument ur era egna arkiv. Om systemet inte hittar stöd säger det det. Ni granskar, ni beslutar.',
		},
	] as const;

	// ───────── Compliance grid ─────────
	readonly compliance = [
		{ label: 'VRGA 2.2', sub: 'Tystnadsplikten', status: 'Strukturellt uppfylld' },
		{ label: 'GDPR Art. 48', sub: 'Tredjelandsöverföring', status: 'Ej tillämplig' },
		{ label: 'Advokatsamfundet', sub: 'Vägledning GenAI 2025', status: 'Förenlig' },
		{ label: 'EU AI Act', sub: 'Riskhantering', status: 'Förenlig' },
		{ label: 'Schrems II', sub: 'Supplementary measures', status: 'Uppfylld' },
		{ label: 'US CLOUD Act', sub: 'Extraterritoriell access', status: 'Ej exponerad' },
		{ label: 'NIS2', sub: 'Kritisk verksamhet', status: 'Implementeringsklar' },
		{ label: 'ISO 27001', sub: 'Driftsäkerhet', status: 'Roadmap 2026' },
	] as const;

	// ───────── Implementation steps ─────────
	readonly steps = [
		{
			roman: 'I',
			title: 'Konfidentiell behovsanalys',
			body: 'Vi besöker er byrå och lyssnar. Vilka ärenden jobbar ni med? Vilken sekretessnivå? Vad behöver kopplas ihop? Utifrån det bygger vi en konfiguration som passar er — ingen standardlösning.',
		},
		{
			roman: 'II',
			title: 'Installation på plats',
			body: 'Vi kommer ut med hårdvaran, ansluter den till ert nätverk och indexerar era handlingar. Allt sker fysiskt hos er. När vi går därifrån fungerar allt.',
		},
		{
			roman: 'III',
			title: 'Igång på riktigt',
			body: 'Vi introducerar systemet för era jurister, hjälper er ta fram interna AI-riktlinjer, och finns kvar för löpande support. Ni ska kunna använda det — inte bara äga det.',
		},
	] as const;

	// ───────── Featured research ─────────
	readonly research = [
		{
			tag: 'Analys',
			title: 'EU Tech Sovereignty Package — vad det betyder för svenska advokatbyråer',
			date: 'Maj 2026',
			image: '/assets/vera/research/eu-sovereignty.jpg',
		},
		{
			tag: 'Vägledning',
			title:
				'Sveriges advokatsamfunds vägledning om generativ AI — sammanfattning för byråledningar',
			date: 'Juni 2025',
			image: '/assets/vera/research/samfundet.jpg',
		},
		{
			tag: 'Rapport',
			title: 'Den globala hallucinationskrisen: 600+ sanktioner under ett år',
			date: 'Januari 2026',
			image: '/assets/vera/research/hallucinations.jpg',
		},
	] as const;

	// ───────── FAQ ─────────
	readonly faqs = [
		{
			q: 'Tränas modellen på vår data?',
			a: 'Nej.',
		},
		{
			q: 'Vad händer om VERA-01 ger fel svar?',
			a: 'Samma sak som om en biträdande jurist gör det.',
		},
		{
			q: 'Vad är skillnanden mellan VERA-01 och en ChatGPT?',
			a: 'VERA-01 körs lokalt och är tränad på svensk rätt. ChatGPT är en generell modell och körs i molnet.',
		},
		{
			q: 'Vad händer om internet ligger nere?',
			a: 'Inget. VERA-01 fungerar fullt offline. All bearbetning sker lokalt.',
		},
		{
			q: 'Ersätter VERA-01 jurister?',
			a: 'Nej. VERA-01 producerar ett svar. Ombudet granskar, justerar och tar ansvar.',
		},
	] as const;

	// ───────── Actions ─────────
	toggleMenu(): void {
		this.isMenuOpen.update((v) => !v);
	}
	toggleFaq(i: number): void {
		this.openFaqIndex.update((c) => (c === i ? null : i));
	}
	selectSolution(i: number): void {
		this.activeSolutionTab.set(i);
	}
	scrollToSection(id: string): void {
		this.isMenuOpen.set(false);
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	submit(): void {
		if (this.demoForm.invalid || this.isSubmitting()) {
			this.demoForm.markAllAsTouched();
			return;
		}
		this.submissionState.set('submitting');
		this.http.post('/api/demo-requests', this.demoForm.getRawValue()).subscribe({
			next: () => {
				this.submissionState.set('success');
				this.demoForm.reset({ consent: false });
			},
			error: () => this.submissionState.set('error'),
		});
	}
}

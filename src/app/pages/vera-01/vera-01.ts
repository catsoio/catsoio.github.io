import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	HostListener,
	inject,
	signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemoBookingService } from '../../services/vera01/demo-booking.service';

@Component({
	selector: 'app-vera-01',
	imports: [CommonModule, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './vera-01.html',
	styleUrl: './vera-01.scss',
})
export class Vera01 {
	private readonly fb = inject(FormBuilder);
	private readonly demoService = inject(DemoBookingService);

	// ───────── UI state ─────────
	readonly isMenuOpen = signal(false);
	readonly openFaqIndex = signal<number | null>(null);
	readonly activeSolutionTab = signal(0);
	readonly isBackgroundExpanded = signal(false);
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
			label: '',
			title: '100% lokalt.',
			body: 'VERA-01 sitter fysiskt på ert kontor. Det betyder att varje fråga, varje svar och varje klientuppgift behandlas i samma rum som era jurister. Ingenting skickas ut. Varken till oss, till ett datacenter eller till någon annan.',
		},
		{
			label: '',
			title: 'Fungerar även offline.',
			body: 'VERA-01 körs 100% offline i byrån. Ingen uppkoppling eller exteran part som kan stängas av eller byta villkor.',
		},
		{
			label: '',
			title: 'Samfundet säger ifrån',
			body: 'Advokatsamfundets vägledning (2025) kräver att klientinformation inte får användas för träning eller utdata till andra, att personuppgifter inte överförs till tredje land. Vi eliminerar samtliga risker genom att köra modellen lokalt hos er.',
		},
		{
			label: '',
			title: 'AI som hittar på saker',
			body: 'Över 600 jurister sanktionerades globalt under 2025 för att deras AI-verktyg hittade på rättsfall som inte existerade. När ni kör AI lokalt mot era egna källor kan ni verifiera varje svar. Det är skillnaden mellan ett verktyg och ett lotteri.',
		},
	] as const;

	readonly stats = [
		{ value: '100', unit: '%', label: 'Lokalt' },
		{ value: '0', unit: '', label: 'API-anrop till tredje part' },
		{ value: '24/7', unit: '', label: 'Tillgänglig' },
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

	readonly solutions = [
		{
			tab: 'Dokumentanalys',
			iconPath:
				'M7 4h7l3 3v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z M14 4v3h3 M9 12h6 M9 16h4',
			title: 'Gå in i förhandlingen som om ni läst varje sida.',
			body: 'FUP, domar, vittnesförhör eller komplexa transaktionshandlingar. Modellen läser in massivt ärendematerial, identifierar nyckelinformation och bygger en sökbar struktur av era dokument. Systemet extraherar exakt det ni letar efter, med omedelbar hänvisning till källan.',
			bullets: [
				'Kronologiska tidslinjer med källhänvisning.',
				'Extraherar specifika datapunkter.',
				'Exporterar direkt till Word, Excel eller PDF',
			],
			image: '/assets/imgs/veramanydocs.png',
			bubble1: '',
			bubble2: '', // /assets/imgs/mormor4.png
		},
		{
			tab: 'Rättsutredning',
			iconPath: 'M12 3v15 M5 6h14 M5 6l-2 7a3 3 0 0 0 6 0L7 6 M19 6l-2 7a3 3 0 0 0 6 0L21 6',
			title: 'Utreder ärendet mot lag och praxis.',
			body: 'Hitta relevanta rättskällor och få strukturerade svar med juridiskt sammanhang och tydliga hänvisningar till relevanta lagar, praxis och förarbeten. Eller låt juristen styra urvalet manuellt och lägga till eller ta bort källor under utredningens gång.',
			bullets: [
				'Citerar lagrum, NJA och förarbeten vid varje slutsats',
				'Välj rättskällor automatiskt eller styr urvalet manuellt',
				'Besvarar enligt juridiska metoden.',
			],
			image: '/assets/imgs/verarattsurredning.png',
			bubble1: '',
			bubble2: '',
		},
		{
			tab: 'Avtalsgranskning',
			iconPath:
				'M7 4h6l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z M13 4v4h4 M9 14l2 2 4-4',
			title: 'Hitta riskerna innan motparten gör det.',
			body: 'Ladda upp ett SPA, NDA, anställnings- eller leverantörsavtal. Modellen jämför och flaggar avvikelser med severity och föreslår förhandlingsstrategi för varje punkt.',
			bullets: [
				'Klassificerar varje avvikelse som gynnsam, ogynnsam eller tvetydig',
				'Föreslår omformuleringar i byråns egen ton och stil',
				'Markerar riskklausuler med severity och konkret rekommendation',
			],
			image: '/assets/imgs/veraavtalgranskning.png',
			bubble1: '',
			bubble2: '',
		},
		{
			tab: 'Due diligence',
			iconPath: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z M9 12l2 2 4-4',
			title: 'Vet vad ni köper innan ni signerar.',
			body: 'Ladda upp hela datarummet, oavsett om det rör sig om 40, 100 eller 500 dokument. VERA-01 klassificerar varje fil, identifierar transaktionsrelevanta fynd och bygger en strukturerad DD-rapport. Allt presenteras med direktlänkar till källdokumenten.',
			bullets: [
				'Klassificerar och prioriterar fynd som HIGH, MEDIUM eller LOW',
				'Identifierar change of control, garantier och pågående tvister',
				'Exporterar till Excel för granskning offline med teamet',
			],
			image: '/assets/imgs/veradd.png',
			bubble1: '',
			bubble2: '',
		},
		{
			tab: 'Dokumentutkast',
			iconPath:
				'M4 19V5a1 1 0 0 1 1-1h10l4 4v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z M15 4v4h4 M9 13l5-5 2 2-5 5h-2v-2Z',
			title: 'Skapa dokument på sekunder med minimal beskrivning.',
			body: 'Generera överklaganden, kravbrev, PM och utkast. Beskriv typ av dokument du behöver, detaljer som ska ingå, så skapas det direkt. Allt sker på ditt språk och i din ton. Varje påstående bygger på källor hämtade direkt från svensk rätt. Inkludera byråns sidhuvud och logotyp, exportera direkt som PDF för att skicka, eller som Word för att finjustera detaljerna.',
			bullets: [
				'Exportera direkt som PDF, Word eller annat valfritt format',
				'Tydliga hänvisningar till svenska rättskällor',
				'Skapas på bara några sekunder',
			],
			image: '/assets/imgs/veradokumentutkast.png',
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
			q: 'Vad är skillnanden mellan VERA-01 och ChatGPT?',
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
	toggleBackground(): void {
		this.isBackgroundExpanded.update((v) => !v);
	}
	selectSolution(i: number): void {
		this.activeSolutionTab.set(i);
	}
	scrollToSection(id: string): void {
		this.isMenuOpen.set(false);
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	async submit(): Promise<void> {
		if (this.demoForm.invalid || this.isSubmitting()) {
			this.demoForm.markAllAsTouched();
			return;
		}
		this.submissionState.set('submitting');
		const v = this.demoForm.getRawValue();
		const extraDetails = [
			v.title ? `Titel: ${v.title}` : '',
			v.phone ? `Telefon: ${v.phone}` : '',
			v.firmSize ? `Byråns storlek: ${v.firmSize}` : '',
			v.message ? `Meddelande: ${v.message}` : '',
		]
			.filter(Boolean)
			.join('\n');
		try {
			await this.demoService.createDemoRequest({
				name: v.fullName,
				email: v.email,
				byra: v.firmName,
				message: extraDetails,
				date: new Date().toISOString(),
				modules: [],
			});
			this.submissionState.set('success');
			this.demoForm.reset({ consent: false });
		} catch {
			this.submissionState.set('error');
		}
	}
}

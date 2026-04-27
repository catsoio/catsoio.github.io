import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface QuickStep {
	key: string;
	eyebrow: string;
	title: string;
	body: string;
	ctaLabel?: string;
	href?: string;
}

interface VeraModel {
	key: string;
	name: string;
	shortName: string;
	subtitle: string;
	description: string;
	icon: string;
	color: string;
	tint: string;
	bestFor: string[];
	userInput: string[];
	promptStarter: string;
	demoChatLabel: string;
	demoDescription: string;
	demoChatUrl: string;
}

interface DemoChat {
	key: string;
	label: string;
	modelName: string;
	description: string;
	url: string;
	color: string;
	tint: string;
}

interface ImageExample {
	key: string;
	modelName: string;
	title: string;
	description: string;
	src: string;
	alt: string;
}

interface FaqItem {
	key: string;
	question: string;
	answer: string;
}

@Component({
	selector: 'app-vera-get-started',
	imports: [CommonModule],
	templateUrl: './vera-get-started.html',
	styleUrl: './vera-get-started.scss',
})
export class VeraGetStarted {
	readonly portalUrl = 'https://vera-01.catso.io/';
	readonly manualUrl = 'https://catso.io/vera-01/get-started';
	readonly demoPeriod = '10 dagar';

	private readonly chatBaseUrl = `${this.portalUrl}s/`;
	private readonly assetBase = '/assets/imgs/vera-01';

	copiedUrl: string | null = null;
	readonly missingImages = new Set<string>();

	readonly quickSteps: QuickStep[] = [
		{
			key: 'login',
			eyebrow: 'Steg 1',
			title: 'Logga in',
			body: 'Gå till inloggningsportalen. Dina kontouppgifter skickas i ett separat mejl.',
			ctaLabel: 'Öppna inloggningsportalen',
			href: this.portalUrl,
		},
		{
			key: 'password',
			eyebrow: 'Steg 2',
			title: 'Byt lösenord',
			body: 'Vi rekommenderar starkt att du byter lösenord direkt efter första inloggningen. Gå till profilikonen, öppna inställningar och välj konto/lösenord.',
		},
		{
			key: 'demo-chats',
			eyebrow: 'Steg 3',
			title: 'Titta på TEST-chattarna',
			body: 'De pinned TEST-chattarna visar praktiska exempel på hur varje modell bör användas. Börja där innan du laddar upp eget material.',
		},
		{
			key: 'choose-model',
			eyebrow: 'Steg 4',
			title: 'Välj rätt VERA-01-modell',
			body: 'Varje modell är optimerad för en specifik juridisk arbetsuppgift. Fel modell ger ofta sämre och mer generiska svar.',
		},
	];

	readonly modelGuide: VeraModel[] = [
		{
			key: 'allman',
			name: 'VERA-01 Allmän',
			shortName: 'Allmän',
			subtitle: 'Klargörande av lag och praxis, eller ett smart bollplank när du kört fast.',
			description:
				'Använd Allmän när du vill resonera, få en juridisk överblick, förstå begrepp eller testa en tanke innan du går vidare till en mer specialiserad modell.',
			icon: '⚖',
			color: '#f02bd6',
			tint: 'rgba(240, 43, 214, 0.10)',
			bestFor: [
				'Snabb juridisk orientering',
				'Förklaringar av begrepp, lagrum och praxis',
				'Bollplank kring strategi, formuleringar och nästa steg',
			],
			userInput: [
				'Jurisdiktion och rättsområde',
				'Kort bakgrund',
				'Vilken fråga du vill få besvarad',
			],
			promptStarter: 'Vad är gränsen för ringa narkotikabrott?',
			demoChatLabel: 'TEST – ALLMÄN',
			demoDescription:
				'Visar hur modellen används som juridiskt bollplank och för snabb rättslig orientering.',
			demoChatUrl: `${this.chatBaseUrl}5282ccd5-e5ec-49f7-879a-b85de5c0cb03`,
		},
		{
			key: 'fup',
			name: 'VERA-01 FUP',
			shortName: 'FUP',
			subtitle:
				'Sammanfattar stora förundersökningsprotokoll och hittar snabbt viktig information.',
			description:
				'Använd FUP när du arbetar med stora utredningsmaterial och behöver hitta förhör, personer, tidslinjer, motsägelser, bevispunkter eller samband.',
			icon: '⚖',
			color: '#2f63ff',
			tint: 'rgba(47, 99, 255, 0.10)',
			bestFor: [
				'Sammanfattning av FUP-material',
				'Identifiering av centrala förhör och händelser',
				'Tidslinjer, bevispunkter, motsägelser och luckor',
			],
			userInput: [
				'FUP som en PDF',
				'Vad du vill att modellen ska sammanfatta T.ex. Samman fatta förhören i detta FUP. Annars räcker det med att du skriver sammanfatta så får du en helhet sammanfattning',
			],
			promptStarter: 'Sammanfatta förhören i detta FUP',
			demoChatLabel: 'TEST – FUP',
			demoDescription:
				'Visar hur modellen arbetar med stora utredningsmaterial, tidslinjer och förhör.',
			demoChatUrl: `${this.chatBaseUrl}e6696755-d6c4-48a6-89bc-34899141a31d`,
		},
		{
			key: 'avtalsgranskning',
			name: 'VERA-01 Avtalsgranskning',
			shortName: 'Avtalsgranskning',
			subtitle:
				'Identifierar risker och oklarheter, granskar klausuler och föreslår konkreta ändringar.',
			description:
				'Använd Avtalsgranskning när du har ett avtal, en klausul eller ett utkast som ska riskbedömas, förbättras eller förhandlas.',
			icon: '⚖',
			color: '#ef3333',
			tint: 'rgba(239, 51, 51, 0.10)',
			bestFor: [
				'Riskmarkeringar i avtal',
				'Otydliga eller ensidiga klausuler',
				'Förhandlingspunkter och alternativa formuleringar',
			],
			userInput: ['Avtalet som PDF'],
			promptStarter: 'Granska avtalet.',
			demoChatLabel: 'TEST – AVTALSGRANSKNING',
			demoDescription:
				'Visar hur modellen granskar klausuler och omvandlar risker till konkreta ändringsförslag.',
			demoChatUrl: `${this.chatBaseUrl}768b696d-d28f-4feb-9269-a1ef1cd2f9a3`,
		},
		{
			key: 'motanalys',
			name: 'VERA-01 Motanalys',
			shortName: 'Motanalys',
			subtitle:
				'Granskar motpartens dokument och levererar angreppspunkter, lagstöd och klientfrågor.',
			description:
				'Använd Motanalys när du har fått in ett dokument från motparten och vill hitta svagheter, processuella risker, bemötandepunkter och frågor till klienten.',
			icon: '⚖',
			color: '#20c92c',
			tint: 'rgba(32, 201, 44, 0.10)',
			bestFor: [
				'Bemötande av motpartens argumentation',
				'Identifiering av svagheter och luckor',
				'Frågor till klient och kompletterande bevisning',
			],
			userInput: ['Motpartens dokument som PDF'],
			promptStarter: 'Granska dokumentet',
			demoChatLabel: 'TEST – MOTANALYS',
			demoDescription:
				'Visar hur modellen bryter ner motpartens argument och föreslår angreppspunkter.',
			demoChatUrl: `${this.chatBaseUrl}4de988c3-d52a-4adf-99c9-cf15573b3ce9`,
		},
		{
			key: 'dokumentutkast',
			name: 'VERA-01 Dokumentutkast',
			shortName: 'Dokumentutkast',
			subtitle:
				'Skapar och hanterar juridiska dokument. Exportera som PDF, Word eller valfritt format.',
			description:
				'Använd Dokumentutkast när du vill skapa ett strukturerat juridiskt dokument från instruktioner, ärendebakgrund eller befintligt material.',
			icon: '⚖',
			color: '#f18a18',
			tint: 'rgba(241, 138, 24, 0.12)',
			bestFor: [
				'Stämningsansökan, yttrande, avtal, PM eller brev',
				'Omskrivning till mer juridiskt språk',
				'Strukturering av argument, yrkanden och grunder',
			],
			userInput: [
				'Dokumenttyp',
				'Mottagare eller forum',
				'Part du företräder',
				'Bakgrund, yrkanden, grunder och önskat tonläge',
			],
			promptStarter: `Skapa ett juridiskt bindande 'enkelt skuldbrev' där jag lånar ut 45 000 kr till Jakob  personnummer 19980104-xxxx.  Du ska  skapa ett professionellt avtal som minimerar min risk som borgenär maximalt. Inkludera utöver standardvillkoren för belopp, amortering och dröjsmålsränta även specifika juridiska klausuler för: Bankdagar: Tydliggörande av vad som gäller om betalningsdatum infaller på en helgdag/röd dag. Omedelbart förfallande (Insolvens/Avtalsbrott): Utförliga villkor för när hela skulden förfaller till omedelbar betalning (t.ex. vid dröjsmål med betalning över x dagar, om gäldenären hamnar i obestånd, får utmätning eller avlider). Tvistelösning....." Applicera skuldbrev och räntalagen`,
			demoChatLabel: 'TEST – Dokumentutkast',
			demoDescription:
				'Visar hur modellen bygger upp ett juridiskt dokument från instruktion till färdigt utkast.',
			demoChatUrl: `${this.chatBaseUrl}9d446559-cc5c-4d1b-873c-73c9a48cb67e`,
		},
		{
			key: 'lagfragor',
			name: 'VERA-01 Lagfrågor',
			shortName: 'Lagfrågor',
			subtitle: 'Förklarar lagrum, visar tillämpning i ditt scenario och anger källor.',
			description:
				'Använd Lagfrågor när du vill få en fokuserad analys av ett lagrum, rekvisit, rättsföljd eller en specifik juridisk fråga.',
			icon: '⚖',
			color: '#18bf1f',
			tint: 'rgba(24, 191, 31, 0.10)',
			bestFor: [
				'Tolkning av lagrum och rekvisit',
				'Tillämpning på ett konkret scenario',
				'Källor, rättslig struktur och kontrollfrågor',
			],
			userInput: [
				'Relevant rättsområde',
				'Faktiska omständigheter',
				'Vilket lagrum eller vilken fråga du vill analysera',
			],
			promptStarter:
				'Förklara hur [lagrum/fråga] ska tillämpas i följande scenario: [scenario]. Ange rekvisit, rättsföljd, möjliga invändningar och relevanta källor.',
			demoChatLabel: 'TEST – LAGFRÅGOR',
			demoDescription:
				'Visar hur modellen går från lagrum till praktisk tillämpning i ett scenario.',
			demoChatUrl: `${this.chatBaseUrl}dfea8d64-cb94-470c-8601-e75568070e0f`,
		},
		{
			key: 'arendeanalys',
			name: 'VERA-01 Ärendeanalys',
			shortName: 'Ärendeanalys',
			subtitle:
				'Analyserar ärendet mot lag och praxis; sammanfattar slutsats, risker och nästa steg.',
			description:
				'Använd Ärendeanalys när du vill få en helhetsbedömning av ett ärende, inklusive styrkor, svagheter, risker, bevisläge och rekommenderade åtgärder.',
			icon: '⚖',
			color: '#f18a18',
			tint: 'rgba(241, 138, 24, 0.12)',
			bestFor: [
				'Långa ärenden med källhänvisningar till lag och praxis',
				'Omskrivning till mer juridiskt språk (Juridiska metoden)',
				'Utgår alltid ifrån lagar och praxis',
			],
			userInput: [
				'Så mycket bakgrund, yrkanden, grunder och önskat tonläge och data som du kan',
			],
			promptStarter:
				'Maria arbetar i elcykelbutiken CykelPro AB, som både säljer och köper in begagnade elcyklar samt utför service och reparationer. Ofta sköter hon butiksförsäljning och leveranser själv, eftersom butikschefen Jonas främst är aktiv i verkstaden med servicearbeten. a) Carl vill köpa en ny elcykel och lockas av ett kampanjerbjudande: 15 % rabatt på elcyklar av märke X som normalt kostar 40 000 kr. Vid ett besök...',
			demoChatLabel: 'TEST – Dokumentutkast',
			demoDescription:
				'Visar hur modellen bygger upp ett juridiskt dokument från instruktion till färdigt utkast.',
			demoChatUrl: `${this.chatBaseUrl}9d446559-cc5c-4d1b-873c-73c9a48cb67e`,
		},
	];

	readonly demoChats: DemoChat[] = this.modelGuide.map((model) => ({
		key: `${model.key}-demo`,
		label: model.demoChatLabel,
		modelName: model.name,
		description: model.demoDescription,
		url: model.demoChatUrl,
		color: model.color,
		tint: model.tint,
	}));

	readonly imageExamples: ImageExample[] = [
		{
			key: 'fup-overview',
			modelName: 'VERA-01 FUP',
			title: 'Extrahera snabba fakta - Markera text och fråga direkt.',
			description:
				'Efter en lång sammanfattning, kan du ställa ännu mer specifika frågor direkt i chatten. till exempel on en viss person. Markera texten',
			src: `${this.assetBase}/vemarmariasvar.jpg`,
			alt: 'Exempelbild som visar FUP-analys i VERA-01.',
		},
		{
			key: 'Exportera dokumentet som PDF direkt med eran logga och info, redo att redigera',
			modelName: 'VERA-01 Dokumentutkast',
			title: 'Exportera enkelt till PDF.',
			description:
				'Efter du har bett om en viss dokumentmall med specifika lagar och parter. Exportera enkelt till PDF',
			src: `${this.assetBase}/exporttopdfdokumentanalys.jpg`,
			alt: 'Exempelbild som visar tidslinje och motsägelser i FUP-modellen.',
		},
	];

	readonly workingRules = [
		'Ladda bara upp material som behövs för uppgiften.',
		'Beskriv processläge, rättsområde och vad du vill uppnå.',
		'Kontrollera alltid juridiska källor, citat och slutsatser innan användning i klientärende.',
	];

	readonly promptChecklist = [
		'Roll: “Jag företräder käranden/svaranden/misstänkt/målsäganden.”',
		'Material: “Jag har laddat upp avtal/FUP/yttrande/beslut.”',
		'Uppgift: “Identifiera risker/sammanfatta/skapa utkast/hitta motsägelser.”',
		'Format: “Svara med rubriker, punktlista, tabell eller färdigt dokumentutkast.”',
		'Kontroll: “Ange osäkerheter och frågor jag bör kontrollera manuellt.”',
	];

	readonly faqs: FaqItem[] = [
		{
			key: 'security',
			question: 'Är detta en säker demomiljö?',
			answer: 'Ja. VERA-01 är avsedd att köras i en säker miljö för advokatbyråer.',
		},
		{
			key: 'data',
			question: 'Vad händer med demodata?',
			answer: 'Demodata raderas efter demoperioden enligt välkomstinformationen.',
		},
		{
			key: 'model-choice',
			question: 'Vilken modell ska jag börja med?',
			answer:
				'Börja med den modell som matchar arbetsuppgiften. För avtal använder du Avtalsgranskning. För FUP använder du FUP. För helhetsbedömning använder du Ärendeanalys.',
		},
		{
			key: 'sources',
			question: 'Kan jag använda svaren direkt i ärenden?',
			answer:
				'Nej. Se svaren som kvalificerat arbetsmaterial. Juridiska slutsatser, källor och citat ska alltid kontrolleras av jurist eller advokat innan användning.',
		},
	];

	isPlaceholderUrl(url: string | undefined | null): boolean {
		return !url || url.includes('REPLACE_WITH_');
	}

	copyLink(url: string): void {
		if (this.isPlaceholderUrl(url)) {
			return;
		}

		if (typeof navigator === 'undefined' || !navigator.clipboard) {
			return;
		}

		void navigator.clipboard.writeText(url);
		this.copiedUrl = url;

		window.setTimeout(() => {
			if (this.copiedUrl === url) {
				this.copiedUrl = null;
			}
		}, 1600);
	}

	markImageAsMissing(key: string): void {
		this.missingImages.add(key);
	}

	isImageMissing(key: string): boolean {
		return this.missingImages.has(key);
	}

	trackByKey(_: number, item: { key: string }): string {
		return item.key;
	}

	trackByText(_: number, item: string): string {
		return item;
	}
}

import { isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	Component,
	DOCUMENT,
	ElementRef,
	inject,
	PLATFORM_ID,
	Renderer2,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'app-hero',
	standalone: true,
	imports: [],
	templateUrl: './hero.component.html',
	styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit {
	@ViewChild('fileContent') fileContentEl!: ElementRef<HTMLDivElement>;
	@ViewChild('fileCard') fileCardEl!: ElementRef<HTMLDivElement>;
	@ViewChild('userTextMsg') userTextMsgEl!: ElementRef<HTMLDivElement>;
	@ViewChild('veraBlock') veraBlockEl!: ElementRef<HTMLDivElement>;
	@ViewChild('thinkingIndicator') thinkingEl!: ElementRef<HTMLDivElement>;
	@ViewChild('veraAnswer') veraAnswerEl!: ElementRef<HTMLDivElement>;
	@ViewChild('veraText') veraTextEl!: ElementRef<HTMLParagraphElement>;
	@ViewChild('veraSources') veraSourcesEl!: ElementRef<HTMLDivElement>;
	@ViewChild('statusText') statusTextEl!: ElementRef<HTMLSpanElement>;

	private originalFileHTML = '';
	private textReady = false;

	private readonly platformId = inject(PLATFORM_ID);
	private readonly doc = inject(DOCUMENT);
	private readonly isBrowser = isPlatformBrowser(this.platformId);
	private readonly statusSequence = ['Läser avtal…', 'Tänker...', 'Sammanställer svar…'];

	private readonly textParts: { text: string; className?: string }[] = [
		{ text: 'Rättslig fråga: ', className: 'text-white/90 font-semibold' },
		{
			text: 'Huruvida CykelPro AB är bundet av det avtal som Maria ingick med Carl om köp av en elcykel för 34 000 kr.',
		},
		{ text: '\n\n' },
		{ text: 'Tillämplig rätt: ', className: 'text-white/90 font-semibold' },
		{
			text: 'Avtalslagens första kapitel reglerar bildandet av avtal genom anbud och accept. Enligt ',
		},
		{ text: '1 kap. 1 § AvtL', className: 'text-veraGold' },
		{
			text: ' är ett anbud bindande för den som avgett det, och ett svar som överensstämmer med anbudet är bindande för den som svarar. Fullmaktsreglerna återfinns i ',
		},
		{ text: '2 kap. 10 § AvtL', className: 'text-veraGold' },
		{
			text: ', där första stycket stadgar att den som ger fullmakt binder huvudmannen för rättshandlingar som fullmäktigen utför inom fullmaktens gränser, och andra stycket fastslår att en anställd med en viss ställning anses ha fullmakt att handla inom de befogenheter som följer av den ställningen. Om en tvist uppstår om huruvida fullmakten överskridits, regleras bevisbördan i ',
		},
		{ text: '2 kap. 25 § AvtL', className: 'text-veraGold' },
		{
			text: ', där den som uppträder som fullmäktig för annan ansvarar för att kunna styrka att fullmakten föreligger och att handlingen är inom dess räckvidd.',
		},
		{ text: '\n\n' },
		{ text: 'Bedömning: ', className: 'text-white/90 font-semibold' },
		{
			text: 'Avtalsbildningens första rekvisit, anbud, är uppfyllt eftersom Maria tydligt erbjöd Carl en elcykel för 34 000 kr, vilket motsvarar ett bindande anbud enligt ',
		},
		{ text: '1 kap. 1 § AvtL', className: 'text-veraGold' },
		{
			text: '. Det andra rekvisitet, accept, är också uppfyllt då Carl utan avvikelser accepterade erbjudandet. Fullmaktskravet är tillfredsställt eftersom Maria är anställd i försäljningsavdelningen och har en normal befogenhet att ingå försäljningsavtal för företagets räkning; detta utgör en implikativ fullmakt enligt ',
		},
		{ text: '2 kap. 10 § AvtL', className: 'text-veraGold' },
		{
			text: '. Vidare har Maria handlat inom de befogenheter som följer av hennes anställning – det finns ingen information om att CykelPro AB har satt en maximal rabatt eller på annat sätt begränsat hennes förhandlingsutrymme – och hon har därför inte överskridit fullmaktens gränser. Enligt ',
		},
		{ text: '2 kap. 25 § AvtL', className: 'text-veraGold' },
		{ text: ' ligger bevisbördan för att visa att Maria saknade befogenhet på CykelPro AB.' },
		{ text: '\n\n' },
		{ text: 'Slutsats: ', className: 'text-white/90 font-semibold' },
		{ text: 'CykelPro AB är ' },
		{ text: 'bundet av avtalet', className: 'text-white/90 font-semibold' },
		{
			text: ' med Carl eftersom alla nödvändiga rekvisit – anbud, accept, fullmakt och handlande inom fullmaktens gränser – är uppfyllda enligt ',
		},
		{ text: '1 kap. 1 § AvtL', className: 'text-veraGold' },
		{ text: ' och ' },
		{ text: '2 kap. 10 § AvtL', className: 'text-veraGold' },
		{
			text: '. Företaget kan endast ogiltigförklara avtalet om det kan bevisa att Maria överskred sin befogenhet, vilket för närvarande saknas.',
		},
	];

	constructor(private renderer: Renderer2) {}

	ngAfterViewInit(): void {
		if (!this.isBrowser) return;
		this.originalFileHTML = this.fileContentEl.nativeElement.innerHTML;
		this.runSequence();
	}

	/* ───── master timeline ───── */

	private async runSequence(): Promise<void> {
		// 1 — Upload progress bar
		await this.simulateUpload();

		// 2 — Restore file card
		await this.delay(600);
		this.fileContentEl.nativeElement.innerHTML = this.originalFileHTML;
		this.reveal(this.fileCardEl, 'msg-enter');

		// 3 — User text message slides in
		await this.delay(1200);
		this.reveal(this.userTextMsgEl, 'msg-enter');

		// 4 — VERA block appears with thinking dots
		await this.delay(800);
		this.reveal(this.veraBlockEl, 'msg-enter');
		this.show(this.thinkingEl);
		this.cycleStatus();

		// 5 — Thinking phase
		await this.delay(2800);

		// 6 — Hide thinking, show answer, start typewriter
		this.hide(this.thinkingEl);
		this.show(this.veraAnswerEl);
		await this.typewriter();

		// 7 — Reveal source chips
		await this.delay(300);
		this.show(this.veraSourcesEl);
		this.veraSourcesEl.nativeElement.classList.add('sources-enter');
	}

	/* ───── upload simulation ───── */

	private simulateUpload(): Promise<void> {
		const el = this.fileContentEl.nativeElement;
		el.innerHTML = `
         <div class="w-full">
            <p class="text-[12px] text-white/50 mb-2">Laddar upp…</p>
            <div class="w-full bg-white/[0.08] rounded-full h-1">
               <div class="h-1 rounded-full bg-gradient-to-r from-veraGold to-veraBronze animate-progress"></div>
            </div>
         </div>`;
		return this.delay(1400);
	}

	/* ───── typewriter ───── */

	private async typewriter(): Promise<void> {
		const el = this.veraTextEl.nativeElement;
		this.renderer.setProperty(el, 'innerHTML', '');

		const cursor = this.renderer.createElement('span');
		this.renderer.addClass(cursor, 'cursor-blink');
		this.renderer.appendChild(cursor, this.renderer.createText('▋'));
		this.renderer.appendChild(el, cursor);

		for (const part of this.textParts) {
			const span = this.renderer.createElement('span');
			if (part.className) {
				for (const cls of part.className.split(' ')) {
					this.renderer.addClass(span, cls);
				}
			}
			this.renderer.insertBefore(el, span, cursor);

			for (const char of part.text) {
				if (char === '\n') {
					const br = this.renderer.createElement('br');
					this.renderer.insertBefore(el, br, cursor);
				} else {
					this.renderer.appendChild(span, this.renderer.createText(char));
				}
				await this.delay(0.5);
			}
		}
		this.textReady = true;

		this.renderer.removeChild(el, cursor);
	}

	/* ───── helpers ───── */

	private reveal(ref: ElementRef, animClass: string): void {
		const el = ref.nativeElement as HTMLElement;
		el.style.opacity = '1';
		el.classList.add(animClass);
	}

	private show(ref: ElementRef): void {
		(ref.nativeElement as HTMLElement).classList.remove('hidden');
	}

	private hide(ref: ElementRef): void {
		(ref.nativeElement as HTMLElement).classList.add('hidden');
	}

	private delay(ms: number): Promise<void> {
		return new Promise((r) => setTimeout(r, ms));
	}

	scrollTo(id: string, ev?: Event): void {
		if (ev) ev.preventDefault();
		if (!this.isBrowser) return;
		const el = this.doc.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	private async cycleStatus(): Promise<void> {
		const el = this.statusTextEl.nativeElement;
		for (const status of this.statusSequence) {
			if (this.textReady) break;
			el.style.opacity = '0';
			await this.delay(200);
			el.textContent = status;
			el.style.opacity = '1';
			await this.delay(500);
		}

		if (!this.textReady) {
			await new Promise<void>((resolve) => {
				const id = setInterval(() => {
					if (this.textReady) {
						clearInterval(id);
						resolve();
					}
				}, 200);
			});
		}

		el.style.opacity = '0';
		await this.delay(200);
		el.textContent = 'Klar';
		el.style.opacity = '1';
	}
}

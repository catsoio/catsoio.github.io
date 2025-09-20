import { isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	Inject,
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
	@ViewChild('veraAnswer') veraAnswerEl!: ElementRef<HTMLParagraphElement>;
	@ViewChild('veraLoader') veraLoaderEl!: ElementRef;
	@ViewChild('veraContainer') veraContainerEl!: ElementRef;
	private originalFileHTML: string = '';
	showLoading = false;

	private readonly textParts = [
		{ text: 'Svar (utdrag): ', className: 'text-veraBronze' },
		{ text: 'Formellt ja', className: 'text-white/90 font-medium' },
		{ text: ' fr.o.m. ' },
		{ text: '9 april 2025', className: 'text-white/90' },
		{ text: ' enligt ' },
		{ text: '12 kap. 42 § 1 p. JB', className: 'text-veraBronze' },
		{
			text: ' (förverkande vid betalningsdröjsmål som varar mer än en vecka efter förfallodagen). ',
		},
		{ text: 'Men', className: 'text-white/90 font-medium' },
		{ text: ' uppsägningen får ingen verkan eftersom hyresgästen ' },
		{ text: 'återvinner', className: 'text-white/90' },
		{ text: ' hyresrätten enligt ' },
		{ text: '12 kap. 44 § JB', className: 'text-veraBronze' },
		{ text: ': delgivning skedde ' },
		{ text: '3 april', className: 'text-white/90' },
		{ text: ' ⇒ treveckorsfristen löper t.o.m. ' },
		{ text: '24 april', className: 'text-white/90' },
		{ text: '; betalning den ' },
		{ text: '22 april', className: 'text-white/90' },
		{ text: ' skedde i tid. Hyresgästen har därmed fortsatt ' },
		{ text: 'rätt till förlängning', className: 'text-white/90' },
		{ text: ' och kan inte skiljas från lägenheten enligt ' },
		{ text: '12 kap. 46 § JB', className: 'text-veraBronze' },
		{ text: '.' },
	];

	// Injicera PLATFORM_ID för att veta om vi är på servern eller i webbläsaren.
	// Injicera Renderer2 för säker DOM-manipulering.
	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private renderer: Renderer2
	) {}

	ngAfterViewInit(): void {
		// VIKTIGT: Kör bara animationskoden om vi är i en webbläsarmiljö.
		if (isPlatformBrowser(this.platformId)) {
			this.originalFileHTML = this.fileContentEl.nativeElement.innerHTML;
			this.startAnimation();
		}
	}

	private startAnimation(): void {
		this.simulateFileUpload();

		setTimeout(() => {
			this.typewriter();
		}, 8200);
	}

	private simulateFileUpload(): void {
		const fileElement = this.fileContentEl.nativeElement;

		fileElement.innerHTML = `
      <div class="w-full">
        <p class="text-sm font-medium text-white/70 mb-1">Laddar upp dokument...</p>
        <div class="w-full bg-white/10 rounded-full h-1.5">
          <div class="h-1.5 rounded-full animate-progress"></div>
        </div>
      </div>
    `;

		setTimeout(() => {
			fileElement.innerHTML = this.originalFileHTML;
			this.showLoading = true;
		}, 1000);
	}

	private async typewriter(): Promise<void> {
		// Hämta native elements för enklare hantering
		const loaderEl = this.veraLoaderEl.nativeElement;
		const answerEl = this.veraAnswerEl.nativeElement;
		const containerEl = this.veraContainerEl.nativeElement;

		// 1. VISA LADDAREN & GÖM TEXT-YTAN
		// ------------------------------------
		// Rensa föregående svar
		this.renderer.setProperty(answerEl, 'innerHTML', '');

		// Se till att laddaren är synlig
		this.renderer.removeClass(loaderEl, 'hidden');

		// Se till att text-paragrafen är dold
		this.renderer.addClass(answerEl, 'hidden');

		// Centrera innehållet (laddaren) i containern
		this.renderer.addClass(containerEl, 'flex');
		this.renderer.addClass(containerEl, 'items-center');
		this.renderer.addClass(containerEl, 'justify-center');

		// ----- HÄR KAN DU LÄGGA IN EN FAKTISK FÖRDRÖJNING OM DU VÄNTAR PÅ ETT API -----
		// Exempel: await new Promise(resolve => setTimeout(resolve, 1500));
		// ----------------------------------------------------------------------------

		// 2. GÖM LADDAREN & VISA TEXT-YTAN (precis innan texten skrivs ut)
		// ------------------------------------
		this.renderer.addClass(loaderEl, 'hidden');
		this.renderer.removeClass(answerEl, 'hidden');

		// Ta bort centreringen så att texten flödar normalt från vänster
		this.renderer.removeClass(containerEl, 'flex');
		this.renderer.removeClass(containerEl, 'items-center');
		this.renderer.removeClass(containerEl, 'justify-center');

		// 3. STARTA SKRIVMASKINS-EFFEKTEN (din befintliga kod)
		// ------------------------------------
		const cursor = this.renderer.createElement('span');
		const cursorText = this.renderer.createText('▋');
		this.renderer.appendChild(cursor, cursorText);
		this.renderer.setAttribute(
			cursor,
			'class',
			'cursor-blink ml-1 text-veraBronze'
		);
		this.renderer.appendChild(answerEl, cursor);

		for (const part of this.textParts) {
			const span = this.renderer.createElement('span');
			if (part.className) {
				this.renderer.setAttribute(span, 'class', part.className);
			}
			this.renderer.insertBefore(answerEl, span, cursor);

			for (const char of part.text) {
				const textNode = this.renderer.createText(char);
				this.renderer.appendChild(span, textNode);
				await new Promise((resolve) => setTimeout(resolve, 20));
			}
		}

		this.renderer.removeChild(answerEl, cursor);
	}
}

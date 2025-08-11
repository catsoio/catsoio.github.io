import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	selector: 'app-ai-prompt-demo',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './ai-prompt-demo.component.html',
	styleUrl: './ai-prompt-demo.component.scss',
})
export class AiPromptDemoComponent implements OnInit, OnDestroy {
	promptText =
		'Är formkraven uppfyllda (skriftlig köpehandling, parter, fastighetsbeteckning, köpeskilling, uttrycklig överlåtelseförklaring, båda parters underskrifter)? Peka ut ev. brister';
	answerText = `Sammanfattning\nFormkraven i 4 kap. 1 § JB är i huvudsak uppfyllda (skriftlig handling, parter, fastighetsbeteckning, köpeskilling, tydlig överlåtelseförklaring). Brister/risken jag ser:\n• Underskrifter saknas - köpet är inte giltigt förrän båda parter undertecknat (4:1 JB).\n• Otillåtet villkor: detaljplan inom 36 månader strider mot tvåårsregeln (4:4 JB) och gör köpet ogiltigt.\n• Fastighetsbeteckningen “Uppsala Knivsta 1:23” kan vara oklar - ange enligt fastighetsregistret (t.ex. “Knivsta 1:23, Knivsta kommun”).`;

	promptContent = '';
	answerContent = '';
	actionsHidden = true;
	detailsHidden = true;
	showContent = false;
	showLoading = false;

	fileChipVisible = false;
	listItems: any[] = []; // You might want to define a specific type for this

	private animationInterval: any;
	private prefersReducedMotion: boolean;

	constructor() {
		this.prefersReducedMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;
	}

	ngOnInit(): void {
		// You could call run() here or from a button click in the template
		this.run();
	}

	ngOnDestroy(): void {
		if (this.animationInterval) {
			clearInterval(this.animationInterval);
		}
	}

	private typeText(text: string, speed: number = 24): Promise<void> {
		return new Promise((resolve) => {
			if (this.prefersReducedMotion || speed <= 0) {
				this.promptContent = text;
				return resolve();
			}
			this.promptContent = '';
			let i = 0;
			this.animationInterval = setInterval(() => {
				if (i < text.length) {
					this.promptContent += text.charAt(i);
					i++;
				} else {
					clearInterval(this.animationInterval);
					resolve();
				}
			}, speed);
		});
	}

	private formatLegalSummary(text: string): string {
		const esc = (s: string) =>
			s.replace(
				/[&<>"']/g,
				(c) =>
					({
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#39;',
					}[c]!)
			);

		const lines = text.trim().split('\n');
		const title = esc(lines.shift()?.trim() || 'Sammanfattning');
		let html = `<h3 class="rubrik">${title}</h3>`;

		let i = 0,
			ulOpen = false;

		if (i < lines.length && !lines[i].trim().startsWith('•')) {
			html += `<p>${esc(lines[i++].trim())}</p>`;
		}

		const statuteWrap = (s: string) =>
			s.replace(
				/(\b\d+\s*kap\.\s*\d+\s*§\s*JB\b|\b\d+:\d+\s*JB\b)/g,
				'<span class="statute">$1</span>'
			);

		for (; i < lines.length; i++) {
			const raw = lines[i].trim();
			if (!raw) continue;

			if (!raw.startsWith('•') && raw.endsWith(':')) {
				if (ulOpen) {
					html += '</ul>';
					ulOpen = false;
				}
				html += `<h4>${esc(raw.slice(0, -1))}</h4>`;
				continue;
			}

			if (raw.startsWith('•')) {
				if (!ulOpen) {
					html += '<ul>';
					ulOpen = true;
				}
				const content = raw.replace(/^•\s*/, '');
				const m = content.match(/^([^-—:-]+)\s*[:-—-]\s*(.*)$/);
				let item = m
					? `<strong>${esc(m[1].trim())}</strong> - ${esc(m[2].trim())}`
					: esc(content);
				item = statuteWrap(item);
				html += `<li>${item}</li>`;
				continue;
			}

			html += `<p>${esc(raw)}</p>`;
		}
		if (ulOpen) html += '</ul>';
		return `<div class="legal-summary">${html}</div>`;
	}

	private async run() {
		this.actionsHidden = true;
		this.detailsHidden = false;
		this.fileChipVisible = true;

		// Using a more Angular-friendly approach to handle animations
		await this.typeText(this.promptText);
		this.showLoading = true;

		this.answerContent = 'Tänker…';
		// Simulating the loading text delay
		setTimeout(() => {
			this.answerContent = this.formatLegalSummary(this.answerText);
			this.revealActions();
			setTimeout(
				() => this.revealDetails(),
				this.prefersReducedMotion ? 0 : 600
			);
			this.showContent = true;
		}, 3600);
	}

	private revealActions() {
		this.actionsHidden = false;
		this.listItems = [
			{
				num: '(i)',
				text: 'Se till att båda parter undertecknar köpehandlingen. Utan underskrifter är köpet ogiltigt (4:1 JB).',
			},
			{
				num: '(ii)',
				text: 'Ändra villkor 10.2 till högst 24 månader eller formulera om så att köpets bestånd inte görs beroende efter två år (4:4 JB).',
			},
			{
				num: '(iii)',
				text: 'Säkerställ korrekt fastighetsbeteckning enligt fastighetsregistret (t.ex. “Knivsta 1:23, Knivsta kommun”).',
			},
			{
				num: '(iv)',
				text: 'Om ni vill att villkoren ska gälla även efter köpebrev - upprepa dem i köpebrevet (4:6 JB).',
			},
		];
	}

	private revealDetails() {
		this.detailsHidden = false;
	}
}

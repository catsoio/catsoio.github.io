import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExpertAreasComponent } from '../expert-areas/expert-areas.component';

type CardIcon = 'time' | 'docs' | 'alert' | 'doc' | 'check' | 'file';

export interface VeraCard {
	key: string;
	title: string;
	question: string;
	wrapperClass: string;
	badgeClass: string;
	icon: CardIcon;
	style?: { [k: string]: string };
}

@Component({
	selector: 'app-modell-workspaces',
	standalone: true,
	imports: [CommonModule, ExpertAreasComponent],
	templateUrl: './modell-workspaces.component.html',
	styleUrl: './modell-workspaces.component.scss',
})
export class ModellWorkspacesComponent {
	VERA_CARDS: VeraCard[] = [
		{
			key: 'arende-analys',
			title: 'VERA-01 Ärende Analys',
			question:
				'Hyresvärden har sagt upp lokalhyresgästen p.g.a. dröjsmål – är förverkande uppfyllt och kan hyresgästen återvinna lokalen enligt 12 kap. JB?',
			wrapperClass:
				'absolute left-2 top-0 w-72 rounded-xl bg-zinc-900/90 backdrop-blur-sm ring-1 ring-white/10 shadow-2xl p-4 transform-gpu transition-transform duration-500 [transform:translateZ(84px)_rotate(-6deg)_translateY(-6px)]',
			badgeClass: 'bg-orange-500/20 text-orange-400',
			icon: 'time',
		},
		{
			key: 'lagfragor',
			title: 'VERA-01 Lagfrågor',
			question:
				'Gäller en ansvarsfriskrivning för följdskador vid maskinköp mellan näringsidkare, eller kan klausulen jämkas enligt 36 § AvtL?',
			wrapperClass:
				'absolute left-36 bottom-12 w-64 rounded-xl bg-zinc-900/90 backdrop-blur-sm ring-1 ring-white/10 shadow-2xl p-4 transform-gpu transition-transform duration-500 [transform:translateZ(48px)_rotate(2deg)_translateY(0)]',
			badgeClass: 'bg-teal-500/20 text-teal-300',
			icon: 'docs',
		},
		{
			key: 'riskbedomning',
			title: 'VERA-01 Riskbedömning',
			question:
				'Är berättigat intresse en hållbar rättslig grund för kamerabevakning i garage/trapphus, och krävs en DPIA enligt art. 35 GDPR?',
			wrapperClass:
				'absolute w-72 rounded-xl bg-zinc-900/90 backdrop-blur-sm ring-1 ring-white/10 shadow-2xl p-4 transform-gpu transition-transform duration-500 [transform:translateZ(100px)_rotate(8deg)_translateY(-2px)]',
			style: { top: '-80px', right: '0px' },
			badgeClass: 'bg-rose-500/20 text-rose-300',
			icon: 'alert',
		},
		{
			key: 'avtalsgranskning',
			title: 'VERA-01 Avtalsgranskning',
			question:
				'Vilka ansvarsbegränsningar och otydliga IPR-klausuler i detta konsultavtal bör omförhandlas för att minska risk utan att rubba affären?',
			wrapperClass:
				'absolute w-72 rounded-xl bg-zinc-900/90 backdrop-blur-sm ring-1 ring-white/10 shadow-2xl p-4 transform-gpu transition-transform duration-500 [transform:translateZ(32px)_rotate(-12deg)_translateY(4px)]',
			style: { top: '180px', left: '-40px' },
			badgeClass: 'bg-fuchsia-500/20 text-fuchsia-300',
			icon: 'doc',
		},
		{
			key: 'bevisvardering',
			title: 'VERA-01 Bevisvärdering',
			question:
				'Hur bygger vi en robust tidslinje och beviskedja ur 10 000+ e-mail – vilka nyckelhändelser och svaga länkar identifieras?',

			wrapperClass:
				'absolute w-72 rounded-xl bg-zinc-900/90 backdrop-blur-sm ring-1 ring-white/10 shadow-2xl p-4 transform-gpu transition-transform duration-500 [transform:translateZ(12px)_rotate(14deg)_translateY(8px)]',
			style: { bottom: '-50px', right: '-20px' },
			badgeClass: 'bg-lime-500/20 text-lime-300',
			icon: 'check',
		},
		{
			key: 'forhandlings-process',
			title: 'VERA-01 Förhandlings- & Processimulator',
			question:
				'Vilka motargument kommer motparten sannolikt att föra i entreprenadtvisten (ÄTA, tidsförlängning, vite) och vilken förlikningsstrategi maximerar utfallet?',
			wrapperClass:
				'absolute w-64 rounded-xl bg-zinc-900/90 backdrop-blur-sm ring-1 ring-white/10 shadow-2xl p-4 transform-gpu transition-transform duration-500 [transform:translateZ(140px)_rotate(-4deg)_translateY(-2px)]',
			style: { top: '50px', right: '80px' },
			badgeClass: 'bg-indigo-500/20 text-indigo-300',
			icon: 'file',
		},
	];
}

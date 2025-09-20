import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
	EventEmitter,
	OnInit,
	Output,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

// Datatyper
export type Category = 'Kärnflöden' | 'Process & Tvist' | 'Affär & Compliance';
type Preset = {
	id: string;
	name: string;
	include: (item: Expertomrade) => boolean;
};
export interface Expertomrade {
	key: string;
	title: string;
	short: string;
	category: Category;
	tags?: string[];
}

@Component({
	selector: 'app-expert-areas',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './expert-areas.component.html',
	styleUrl: './expert-areas.component.scss',
})
export class ExpertAreasComponent implements OnInit {
	ngOnInit(): void {
		this.selectPreset('affar');
	}
	// Kontakt (lead)
	contact = { name: '', email: '', org: '' };

	// State
	query = signal('');
	selected = signal<Set<string>>(new Set());
	selectedCategory = signal<'Alla' | Category>('Alla');
	showAll = signal(false);

	// Data
	expertomraden: Expertomrade[] = [
		{
			key: 'lagfragor',
			title: 'Lagfrågor',
			short: 'Q&A med källhänvisning',
			category: 'Kärnflöden',
		},
		{
			key: 'arandeanalys',
			title: 'Ärendeanalys',
			short: 'Strukturerar sakfrågor & invändningar',
			category: 'Kärnflöden',
		},
		{
			key: 'avtalsgransk',
			title: 'Avtalsgranskning',
			short: 'Riskflaggor, klausuler, rekommendationer',
			category: 'Kärnflöden',
		},
		{
			key: 'research',
			title: 'Research & rättskällekompass',
			short: 'Praxis-sök, citat och hierarki',
			category: 'Affär & Compliance',
		},
		{
			key: 'inlagor',
			title: 'Inlagor & skrivelser',
			short: 'Stämning, svaromål, överklagande, PM',
			category: 'Process & Tvist',
		},
		{
			key: 'risk',
			title: 'Riskbedömning',
			short: 'Huvudrisker, luckor, åtgärdslista',
			category: 'Process & Tvist',
		},
		{
			key: 'bevis',
			title: 'Bevisvärdering',
			short: 'Styrka, relevans, bevisbörda',
			category: 'Process & Tvist',
		},
		{
			key: 'forhandling',
			title: 'Förhandling & processstrategi',
			short: 'Strategi, utfall, argumentationsplan',
			category: 'Process & Tvist',
		},
		{
			key: 'avtalgenerator',
			title: 'Avtalsgenerator',
			short: 'Guidad framtagning + klausulbibliotek',
			category: 'Affär & Compliance',
		},
	];

	// Filtrering (minimal): sök + kategori
	filtered = computed(() => {
		const q = this.query().trim().toLowerCase();
		const cat = this.selectedCategory();
		return this.expertomraden.filter((x) => {
			const okQ =
				!q ||
				x.title.toLowerCase().includes(q) ||
				x.short.toLowerCase().includes(q);
			const okC = cat === 'Alla' || x.category === cat;
			return okQ && okC;
		});
	});

	// Visa 6 först
	MAX_VISIBLE = 6;
	visibleList = computed(() =>
		this.showAll()
			? this.filtered()
			: this.filtered().slice(0, this.MAX_VISIBLE)
	);
	filteredCount = computed(() => this.filtered().length);

	// Selection
	selectedCount = computed(() => this.selected().size);
	toggle(key: string) {
		this.selected.update((s) => {
			const n = new Set(s);
			n.has(key) ? n.delete(key) : n.add(key);
			return n;
		});
	}
	resetSelection() {
		this.selected.set(new Set());
	}

	// Presets (snabbval)
	presets: {
		id: string;
		name: string;
		include: (x: Expertomrade) => boolean;
	}[] = [
		{
			id: 'tvist',
			name: 'Tvist & process',
			include: (x) => x.category === 'Process & Tvist',
		},
		{
			id: 'affar',
			name: 'Affärsjuridik',
			include: (x) =>
				x.category === 'Affär & Compliance' || x.key === 'avtalsgransk',
		},
		{ id: 'full', name: 'Full byråsuite', include: () => true },
		{ id: 'tom', name: 'x', include: () => false },
	];

	// Modal
	showForm = signal(false);
	openForm() {
		this.showForm.set(true);
	}
	closeForm() {
		this.showForm.set(false);
	}

	// Utsignal
	@Output() demoRequested = new EventEmitter<{
		contact: { name: string; email: string; org: string };
		selectedKeys: string[];
		selectedTitles: string[];
	}>();

	onSubmit() {
		if (this.selectedCount() === 0) return;
		const chosen = this.expertomraden.filter((x) => this.selected().has(x.key));
		const payload = {
			contact: { ...this.contact },
			selectedKeys: chosen.map((c) => c.key),
			selectedTitles: chosen.map((c) => c.title),
		};
		this.demoRequested.emit(payload);
		this.closeForm();
		alert(`Tack! Demo begärd för: ${payload.selectedTitles.join(', ')}`);
	}

	private keysForPreset(p: Preset): Set<string> {
		const s = new Set<string>();
		if (p.id === 'tom') return s;
		this.expertomraden.forEach((item) => {
			if (p.include(item)) s.add(item.key);
		});
		return s;
	}

	private setsEqual<T>(a: Set<T>, b: Set<T>): boolean {
		if (a.size !== b.size) return false;
		for (const v of a) if (!b.has(v)) return false;
		return true;
	}

	/** Vilket preset är aktivt givet selected()? */
	activePresetId = computed(() => {
		const sel = this.selected();
		if (sel.size === 0) return 'tom';
		for (const p of this.presets) {
			if (p.id === 'tom') continue;
			if (this.setsEqual(this.keysForPreset(p), sel)) return p.id;
		}
		return null; // inget preset matchar exakt (t.ex. manuell mix)
	});

	isPresetActive(p: Preset): boolean {
		return this.activePresetId() === p.id;
	}

	selectPreset(id: string) {
		const preset = this.presets.find((p) => p.id === id);
		if (!preset) return;

		// Tomt preset = töm val
		if (id === 'tom') {
			this.selected.set(new Set());
			return;
		}

		// Sätt selected till presettets taggar
		this.selected.set(this.keysForPreset(preset));
	}

	/** Manuell toggling av en tagg */
	toggleTag(key: string) {
		const next = new Set(this.selected());
		if (next.has(key)) next.delete(key);
		else next.add(key);
		this.selected.set(next);
		// activePresetId uppdateras automatiskt via computed()
	}
}

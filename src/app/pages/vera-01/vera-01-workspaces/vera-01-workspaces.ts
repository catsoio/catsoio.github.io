import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoBookingService } from '../../../services/vera01/demo-booking.service';

interface Workflow {
	id: string;
	title: string;
	shortDescription: string;
	details: string[];
}

@Component({
	selector: 'app-vera-01-workspaces',
	imports: [FormsModule],
	templateUrl: './vera-01-workspaces.html',
	styleUrl: './vera-01-workspaces.scss',
})
export class Vera01Workspaces {
	private demoService = inject(DemoBookingService);

	workflows: Workflow[] = [
		{
			id: 'analys',
			title: 'Analys',
			shortDescription: 'Från tusentals sidor råmaterial till fullständig överblick på minuter.',
			details: [
				'Kronologisk tidslinje och händelseförlopp',
				'Identifiering av motsägelser och luckor i förhör',
				'Angreppspunkter, lagstöd och förslag på klientfrågor',
				'Sidhänvisningar direkt in i akten',
			],
		},
		{
			id: 'avtalsgranskning',
			title: 'Avtalsgranskning',
			shortDescription:
				'Identifiera risker, granska klausuler och få konkreta förhandlingspunkter.',
			details: [
				'Identifiering av risker, oklarheter och ogynnsamma klausuler',
				'Jämförelse mot standardvillkor och branschnorm',
				'Konkreta ändringsförslag och förhandlingspunkter',
			],
		},
		{
			id: 'dokumentutkast',
			title: 'Dokumentutkast',
			shortDescription: 'Generera juridiska dokument och klientkommunikation på sekunder.',
			details: [
				'Utkast till inlagor, överklaganden och avtal',
				'Klientbrev baserade på ärendets dokument',
				'Export som PDF eller Word direkt från akten',
			],
		},
	];

	selectedIds = new Set<string>();
	showForm = false;
	submitting = false;
	submitSuccess = false;
	submitError = false;

	form = {
		name: '',
		email: '',
		byra: '',
		message: '',
	};

	toggleWorkflow(id: string): void {
		if (this.selectedIds.has(id)) {
			this.selectedIds.delete(id);
		} else {
			this.selectedIds.add(id);
		}
		this.selectedIds = new Set(this.selectedIds);
	}

	isSelected(id: string): boolean {
		return this.selectedIds.has(id);
	}

	getLabelById(id: string): string {
		return this.workflows.find((w) => w.id === id)?.title ?? id;
	}

	openDemoForm(): void {
		this.submitSuccess = false;
		this.submitError = false;
		this.showForm = true;
	}

	closeForm(): void {
		this.showForm = false;
	}

	async submitDemo(): Promise<void> {
		if (!this.form.name || !this.form.email || !this.form.byra) return;
		this.submitting = true;
		this.submitError = false;

		try {
			await this.demoService.createDemoRequest({
				name: this.form.name,
				email: this.form.email,
				byra: this.form.byra,
				message: this.form.message,
				date: new Date().toISOString(),
				modules: Array.from(this.selectedIds),
			});
			this.submitSuccess = true;
			this.form = { name: '', email: '', byra: '', message: '' };
			this.selectedIds = new Set();
			setTimeout(() => this.closeForm(), 2500);
		} catch {
			this.submitError = true;
		} finally {
			this.submitting = false;
		}
	}
}

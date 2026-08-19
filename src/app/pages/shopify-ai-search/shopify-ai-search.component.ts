import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoBookingService } from '../../services/vera01/demo-booking.service';

@Component({
	selector: 'app-shopify-ai-search',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, RouterLink, FormsModule],
	templateUrl: './shopify-ai-search.component.html',
	styleUrl: './shopify-ai-search.component.scss',
})
export class ShopifyAiSearchComponent {
	private readonly leads = inject(DemoBookingService);

	readonly currentYear = new Date().getFullYear();


	readonly plans = [
		{
			name: 'Starter',
			price: '$19',
			audience: 'För butiker som precis kommit igång',
			highlight: false,
			features: [
				'5 000 sökningar per månad',
				'Hanterar stavfel och synonymer',
				'Uppdateras automatiskt med sortimentet',
				'Support via e-post',
			],
		},
		{
			name: 'Growth',
			price: '$49',
			audience: 'För butiker i tillväxt',
			highlight: true,
			features: [
				'25 000 sökningar per månad',
				'Allt i Starter',
				'Statistik över vad kunder söker på och inte hittar',
				'Egna synonymer och styrda träffar',
			],
		},
		{
			name: 'Pro',
			price: '$99',
			audience: 'För stora sortiment och hög trafik',
			highlight: false,
			features: [
				'100 000 sökningar per månad',
				'Allt i Growth',
				'Snabbare uppdatering vid stora sortimentsändringar',
				'Prioriterad support',
			],
		},
	];

	readonly form = {
		name: '',
		store: '',
		email: '',
		message: '',
	};

	readonly submitting = signal(false);
	readonly submitSuccess = signal(false);
	readonly submitError = signal(false);

	async submit(): Promise<void> {
		if (!this.form.name || !this.form.email || !this.form.store) return;
		this.submitting.set(true);
		this.submitError.set(false);
		this.submitSuccess.set(false);

		try {
			await this.leads.createShopifyAiSearchLead({
				name: this.form.name,
				email: this.form.email,
				store: this.form.store,
				message: this.form.message,
			});
			this.submitSuccess.set(true);
			this.form.name = '';
			this.form.store = '';
			this.form.email = '';
			this.form.message = '';
		} catch {
			this.submitError.set(true);
		} finally {
			this.submitting.set(false);
		}
	}
}

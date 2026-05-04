import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoBookingService } from '../../../services/vera01/demo-booking.service';

@Component({
	selector: 'app-vera-01-contact',
	imports: [FormsModule],
	templateUrl: './vera-01-contact.html',
	styleUrl: './vera-01-contact.scss',
})
export class Vera01Contact {
	private demoService = inject(DemoBookingService);

	submitting = false;
	submitSuccess = false;
	submitError = false;

	form = {
		name: '',
		byra: '',
		email: '',
		message: '',
	};

	async submit(): Promise<void> {
		if (!this.form.name || !this.form.email || !this.form.byra) return;
		this.submitting = true;
		this.submitError = false;
		this.submitSuccess = false;

		try {
			await this.demoService.createDemoRequest({
				name: this.form.name,
				email: this.form.email,
				byra: this.form.byra,
				message: this.form.message,
				date: new Date().toISOString(),
				modules: [],
			});
			this.submitSuccess = true;
			this.form = { name: '', byra: '', email: '', message: '' };
		} catch {
			this.submitError = true;
		} finally {
			this.submitting = false;
		}
	}
}

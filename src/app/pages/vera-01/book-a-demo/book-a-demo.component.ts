import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemoBookingService, DemoRequest } from '../../../services/vera01/demo-booking.service';

@Component({
	selector: 'app-book-a-demo',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './book-a-demo.component.html',
	styleUrl: './book-a-demo.component.scss',
})
export class BookADemoComponent {
	private fb = inject(FormBuilder);
	private api = inject(DemoBookingService);

	loading = signal(false);
	success = signal<null | string>(null);
	error = signal<null | string>(null);

	form = this.fb.group({
		name: ['', [Validators.required, Validators.minLength(2)]],
		email: ['', [Validators.required, Validators.email]],
		firm: ['', [Validators.required, Validators.minLength(2)]],
		message: [''],
		// honeypot to deter simple bots (kept empty by real users)
		website: [''],
	});

	async submit() {
		this.success.set(null);
		this.error.set(null);

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		if (this.form.value.website) {
			// bot detected -> act as success but ignore
			this.success.set('Tack! Vi hör av oss.');
			this.form.reset();
			return;
		}

		this.loading.set(true);
		const payload: DemoRequest = {
			name: this.form.value.name!,
			email: this.form.value.email!,
			firm: this.form.value.firm!,
			message: this.form.value.message ?? '',
		};

		try {
			await this.api.createDemoRequest(payload);
			this.success.set('Tack! Vi hör av oss med förslag på tid.');
			this.form.reset();
		} catch (e: any) {
			this.error.set(e?.message ?? 'Något gick fel. Försök igen.');
		} finally {
			this.loading.set(false);
		}
	}
}

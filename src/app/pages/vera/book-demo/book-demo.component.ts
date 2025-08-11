import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	Validators,
	ReactiveFormsModule,
	FormGroup,
} from '@angular/forms';
import { BookingService } from '../services/booking.service';

@Component({
	selector: 'app-book-demo',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],

	templateUrl: './book-demo.component.html',
	styleUrl: './book-demo.component.scss',
})
export class BookDemoComponent {
	private fb = inject(FormBuilder);

	form = this.fb.group({
		name: ['', [Validators.required, Validators.minLength(2)]],
		email: ['', [Validators.required, Validators.email]],
		message: [''],
	});

	submitting = signal(false);
	success = signal<null | string>(null);
	error = signal<null | string>(null);

	constructor(private booking: BookingService) {
		this.fb.group({
			name: ['', [Validators.required, Validators.minLength(2)]],
			email: ['', [Validators.required, Validators.email]],
			message: [''],
		});
	}

	submit() {
		this.error.set(null);
		this.success.set(null);
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.submitting.set(true);
		this.booking.createBooking(this.form.value as any).subscribe({
			next: (res) => {
				this.success.set('Tack! Vi återkommer snart för att boka in er demo.');
				this.form.reset();
				this.submitting.set(false);
			},
			error: (err) => {
				this.error.set('Något gick fel. Försök igen om en stund.');
				this.submitting.set(false);
			},
		});
	}

	get f() {
		return this.form.controls;
	}
}

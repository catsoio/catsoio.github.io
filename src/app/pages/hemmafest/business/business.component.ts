import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
	ReactiveFormsModule,
	FormBuilder,
	FormGroup,
	FormControl,
	Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
	BusinessService,
	BusinessInquiryRequest,
	BusinessInquiryResponse,
} from '../../../services/hemmafest/business.service';

type UiState = 'idle' | 'submitting' | 'success' | 'error';

interface Package {
	id: string;
	name: string;
	placement: string;
	visibility: string;
	price: string;
	highlight?: boolean;
}

@Component({
	selector: 'app-hemmafest-business',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
	templateUrl: './business.component.html',
	styleUrl: './business.component.scss',
})
export class BusinessComponent {
	private fb = inject(FormBuilder);
	private business = inject(BusinessService);

	readonly appStoreUrl = 'https://apps.apple.com/se/app/hemmafest/id6736556918?uo=2';

	packages: Package[] = [
		{
			id: 'bas',
			name: 'Bas',
			placement: 'Banner',
			visibility: 'Roterar med andra banners',
			price: '2 000 kr / mån',
		},
		{
			id: 'plus',
			name: 'Plus',
			placement: 'Banner + Swipe',
			visibility: 'Prioriterad rotation',
			price: '5 000 kr / mån',
			highlight: true,
		},
		{
			id: 'premium',
			name: 'Premium',
			placement: 'Swipe',
			visibility: 'Egen kampanjperiod',
			price: 'Offert',
		},
	];

	steps = [
		'Du hör av dig via formuläret här nedanför.',
		'Vi lägger upp din annons: titel, text, bild, länk och placering.',
		'Annonsen visas direkt i appen för vår målgrupp.',
		'Vi kan pausa, ändra eller ta bort den när som helst.',
	];

	state: UiState = 'idle';
	errorMsg = '';
	response?: BusinessInquiryResponse;

	form: FormGroup<{
		company: FormControl<string>;
		contact_name: FormControl<string>;
		email: FormControl<string>;
		phone: FormControl<string | null>;
		package: FormControl<string | null>;
		message: FormControl<string | null>;
	}> = this.fb.nonNullable.group({
		company: ['', [Validators.required, Validators.maxLength(190)]],
		contact_name: ['', [Validators.required, Validators.maxLength(190)]],
		email: ['', [Validators.required, Validators.email, Validators.maxLength(190)]],
		phone: this.fb.control<string | null>('', { validators: [Validators.maxLength(60)] }),
		package: this.fb.control<string | null>('', { validators: [Validators.maxLength(40)] }),
		message: this.fb.control<string | null>('', { validators: [Validators.maxLength(3000)] }),
	});

	selectPackage(id: string) {
		this.form.controls.package.setValue(id);
	}

	submit() {
		if (this.form.invalid || this.state === 'submitting') {
			this.form.markAllAsTouched();
			return;
		}
		this.state = 'submitting';
		this.errorMsg = '';
		this.response = undefined;

		const payload: BusinessInquiryRequest = {
			company: this.form.value.company!,
			contact_name: this.form.value.contact_name!,
			email: this.form.value.email!,
			phone: this.form.value.phone ?? undefined,
			package: this.form.value.package ?? undefined,
			message: this.form.value.message ?? undefined,
			source: 'landing',
		};

		this.business
			.sendInquiry(payload)
			.pipe(finalize(() => (this.state = this.state === 'submitting' ? 'idle' : this.state)))
			.subscribe({
				next: (res) => {
					this.response = res;
					this.state = 'success';
					this.form.reset({ package: '' });
				},
				error: (err) => {
					this.state = 'error';
					this.errorMsg =
						(err?.error?.message as string) || 'Något gick fel. Försök igen om en stund.';
				},
			});
	}
}

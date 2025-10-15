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
	UsersService,
	DeleteAccountResponse,
	DeleteAccountRequest,
} from '../../../services/hemmafest/users.service';

type UiState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
	selector: 'app-request-delete-account',
	imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
	templateUrl: './request-delete-account.html',
	styleUrl: './request-delete-account.scss',
})
export class RequestDeleteAccount {
	private fb = inject(FormBuilder);
	private users = inject(UsersService);

	state: UiState = 'idle';
	errorMsg = '';
	response?: DeleteAccountResponse;

	form: FormGroup<{
		email: FormControl<string>;
		userId: FormControl<string | null>;
		reason: FormControl<string | null>;
		consent: FormControl<boolean>;
	}> = this.fb.nonNullable.group({
		email: ['', [Validators.required, Validators.email, Validators.maxLength(190)]],
		userId: this.fb.control<string | null>('', { validators: [Validators.maxLength(120)] }),
		reason: this.fb.control<string | null>('', { validators: [Validators.maxLength(600)] }),
		consent: [false, [Validators.requiredTrue]],
	});

	submit() {
		if (this.form.invalid || this.state === 'submitting') {
			this.form.markAllAsTouched();
			return;
		}
		this.state = 'submitting';
		this.errorMsg = '';
		this.response = undefined;

		const payload: DeleteAccountRequest = {
			email: this.form.value.email!,
			userId: this.form.value.userId ?? undefined,
			reason: this.form.value.reason ?? undefined,
			consent: this.form.value.consent === true,
			platform: this.detectPlatform(),
			appVersion: this.getAppVersionFromUA(),
			locale: navigator.language,
			userAgent: navigator.userAgent,
		};

		this.users
			.requestDeleteAccount(payload)
			.pipe(
				finalize(
					() =>
						(this.state = this.response
							? 'success'
							: this.state === 'submitting'
							? 'idle'
							: this.state)
				)
			)
			.subscribe({
				next: (res) => {
					this.response = res;
					this.state = 'success';
				},
				error: (err) => {
					this.state = 'error';
					this.errorMsg = (err?.error?.message as string) || 'Något gick fel. Försök igen.';
				},
			});
	}

	private detectPlatform(): 'ios' | 'android' | 'web' {
		const ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) return 'ios';
		if (/android/.test(ua)) return 'android';
		return 'web';
	}

	private getAppVersionFromUA(): string | undefined {
		// If you inject your real app version at runtime, parse it here.
		// For now, try to read something sensible or return undefined.
		return undefined;
	}
}

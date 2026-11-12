import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, isDevMode, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const PHOTO = '/assets/imgs/axle';
type FormState = 'idle' | 'sending' | 'sent' | 'error';

/** Catso Hall: bilhandeln i samma system som Axle. Egen sida, /hall. */
@Component({
	selector: 'app-hall-landing',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './hall-landing.component.html',
	styleUrl: './hall-landing.component.scss',
})
export class HallLandingComponent {
	private readonly http = inject(HttpClient);
	private readonly fb = inject(FormBuilder);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

	readonly product = 'Catso Hall';
	readonly photo = PHOTO;
	readonly currentYear = new Date().getFullYear();

	readonly partners = [{ name: 'Blocket', src: `${PHOTO}/partners/blocket.svg` }];

	readonly features = [
		{
			title: 'Koll på varje bil',
			text: 'Inköpspris, kostnader och vinst på varje bil. Se hur länge den har stått och vad ni har bundet i lager.',
		},
		{
			title: 'Affären på ett kort',
			text: 'Köpare, bil, tillägg och rabatt samlas på ett kort. Bokför affären och skicka fakturan till kunden.',
		},
		{
			title: 'Egen webbplats för bilarna',
			text: 'Bilarna visas på en webbplats med er egen domän. Intresseanmälningarna kommer till er mejl.',
		},
	];

	readonly form = this.fb.nonNullable.group({
		name: ['', [Validators.required, Validators.maxLength(120)]],
		workshop: ['', [Validators.maxLength(160)]],
		email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
		phone: ['', [Validators.maxLength(40)]],
		website: [''], // honeypot, ska förbli tom
	});
	readonly state = signal<FormState>('idle');
	readonly submitted = signal(false);

	private get apiBase(): string {
		return isDevMode() ? 'http://localhost:3000/api' : 'https://api.catso.io/api';
	}

	async submit(): Promise<void> {
		this.submitted.set(true);
		if (this.form.invalid || this.state() === 'sending' || !this.browser) return;
		this.state.set('sending');
		try {
			await firstValueFrom(
				this.http.post(`${this.apiBase}/contact`, {
					...this.form.getRawValue(),
					message: `Vill boka en demo av ${this.product}.`,
					product: this.product,
				}),
			);
			this.state.set('sent');
			this.form.reset();
			this.submitted.set(false);
		} catch {
			this.state.set('error');
		}
	}
}

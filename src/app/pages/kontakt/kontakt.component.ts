import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteFooterComponent } from '../../shared/site-footer.component';
import { SiteHeaderComponent } from '../../shared/site-header.component';

@Component({
	selector: 'app-kontakt',
	standalone: true,
	imports: [ReactiveFormsModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
	template: `
		<div class="bg-white text-black">
			<app-site-header />
			<main class="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-5">
				<div class="lg:col-span-2">
					<nav aria-label="Brödsmulor" class="mb-6 text-sm text-black/50">
						<a routerLink="/" class="hover:text-black">Catso</a> <span aria-hidden="true" class="mx-1">/</span> Kontakt
					</nav>
					<h1 class="text-4xl font-semibold tracking-tight md:text-5xl">Kontakta Catso</h1>
					<p class="mt-5 text-lg text-black/65">
						Berätta vad ni vill automatisera eller lösa, så svarar vi på mejlet. Frågar du om priser, säg vilken
						produkt och hur stor verksamheten är.
					</p>
					<dl class="mt-8 space-y-4 text-sm">
						<div>
							<dt class="font-semibold">E-post</dt>
							<dd class="mt-1">
								<a href="mailto:support@catso.io" class="text-black/65 underline">support&#64;catso.io</a>
							</dd>
						</div>
						<div>
							<dt class="font-semibold">Produkter</dt>
							<dd class="mt-1 text-black/65">
								<a routerLink="/vera-01" class="underline">VERA-01</a>,
								<a routerLink="/shopify/apps/ai-search" class="underline">Catso AI Sök</a>,
								<a routerLink="/apps/axle" class="underline">Catso Axle</a>
							</dd>
						</div>
					</dl>
				</div>

				<div class="lg:col-span-3">
					@if (state() === 'sent') {
						<div class="rounded-2xl border border-emerald-600/30 bg-emerald-50 p-8" role="status">
							<h2 class="text-xl font-semibold">Tack, vi har fått ditt meddelande</h2>
							<p class="mt-2 text-black/65">Vi svarar på mejlet så fort vi kan.</p>
						</div>
					} @else {
						<form
							[formGroup]="form"
							(ngSubmit)="submit()"
							class="space-y-5 rounded-2xl border border-black/10 bg-black/[0.02] p-6 sm:p-8"
							novalidate
						>
							<div class="grid gap-5 sm:grid-cols-2">
								<label class="block text-sm">
									<span class="font-medium">Namn</span>
									<input formControlName="name" autocomplete="name" class="field" />
									@if (submitted() && form.controls.name.invalid) {
										<span class="mt-1 block text-red-600">Skriv ditt namn.</span>
									}
								</label>
								<label class="block text-sm">
									<span class="font-medium">Företag</span>
									<input formControlName="workshop" autocomplete="organization" class="field" />
								</label>
								<label class="block text-sm">
									<span class="font-medium">E-post</span>
									<input type="email" formControlName="email" autocomplete="email" class="field" />
									@if (submitted() && form.controls.email.invalid) {
										<span class="mt-1 block text-red-600">Skriv en giltig e-postadress.</span>
									}
								</label>
								<label class="block text-sm">
									<span class="font-medium">Telefon (valfritt)</span>
									<input type="tel" formControlName="phone" autocomplete="tel" class="field" />
								</label>
							</div>
							<label class="block text-sm">
								<span class="font-medium">Meddelande</span>
								<textarea formControlName="message" rows="6" class="field"></textarea>
								@if (submitted() && form.controls.message.invalid) {
									<span class="mt-1 block text-red-600">Skriv ett meddelande.</span>
								}
							</label>
							<input type="text" formControlName="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />
							@if (state() === 'error') {
								<p class="text-sm text-red-600" role="alert">
									Det gick inte att skicka. Mejla oss på support&#64;catso.io i stället.
								</p>
							}
							<button
								type="submit"
								[disabled]="state() === 'sending'"
								class="inline-flex h-12 items-center rounded-2xl bg-black px-6 text-base font-medium text-white hover:bg-black/85 disabled:opacity-60"
							>
								{{ state() === 'sending' ? 'Skickar…' : 'Skicka' }}
							</button>
							<p class="text-xs text-black/45">
								Vi använder uppgifterna bara för att svara dig. Läs vår
								<a routerLink="/integritet" class="underline">integritetspolicy</a>.
							</p>
						</form>
					}
				</div>
			</main>
			<app-site-footer />
		</div>
	`,
	styles: `
		.field {
			margin-top: 0.25rem;
			width: 100%;
			border-radius: 0.75rem;
			border: 1px solid rgb(0 0 0 / 0.15);
			background: #fff;
			padding: 0.65rem 0.85rem;
			color: #000;
		}
		.field:focus {
			border-color: #000;
			outline: none;
		}
	`,
})
export class KontaktComponent {
	private readonly http = inject(HttpClient);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly fb = inject(FormBuilder);

	readonly form = this.fb.nonNullable.group({
		name: ['', [Validators.required, Validators.maxLength(120)]],
		workshop: ['', [Validators.maxLength(160)]],
		email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
		phone: ['', [Validators.maxLength(40)]],
		message: ['', [Validators.required, Validators.maxLength(4000)]],
		website: [''], // honeypot, ska förbli tom
	});
	readonly state = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
	readonly submitted = signal(false);

	async submit(): Promise<void> {
		this.submitted.set(true);
		if (this.form.invalid || this.state() === 'sending' || !this.browser) return;
		this.state.set('sending');
		try {
			await firstValueFrom(
				this.http.post(`${environment.apiBaseUrl}/api/contact`, { ...this.form.getRawValue(), product: 'Catso' })
			);
			this.state.set('sent');
		} catch {
			this.state.set('error');
		}
	}
}

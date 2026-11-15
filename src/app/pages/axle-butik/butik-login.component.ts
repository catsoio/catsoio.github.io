import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButikStore } from './butik.store';

/** Inloggning med Axle-kontot, så att verkstadens uppgifter fylls i vid beställning. */
@Component({
	selector: 'app-butik-login',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule],
	template: `
		@if (store.loginOpen()) {
			<div class="fixed inset-0 z-[60] grid place-items-center bg-black/40 px-4" (click)="close()" role="presentation">
				<form class="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl" (click)="$event.stopPropagation()" (ngSubmit)="submit()" role="dialog" aria-modal="true" aria-label="Logga in">
					<div>
						<h2 class="text-2xl font-extrabold text-[#0d1b1b]">Logga in</h2>
						<p class="mt-1 text-[#6b7f7f]">Med ert Axle-konto fylls företagsuppgifterna i åt er.</p>
					</div>
					<label class="block">
						<span class="mb-1 block font-semibold text-[#0d1b1b]">E-post eller mobilnummer</span>
						<input name="id" class="w-full rounded-xl border-[1.5px] border-[#d5e0e0] px-3 py-2.5 outline-none focus:border-[#00706a]" [ngModel]="identifier()" (ngModelChange)="identifier.set($event)" autocomplete="username" required />
					</label>
					<label class="block">
						<span class="mb-1 block font-semibold text-[#0d1b1b]">Lösenord</span>
						<input name="pw" type="password" class="w-full rounded-xl border-[1.5px] border-[#d5e0e0] px-3 py-2.5 outline-none focus:border-[#00706a]" [ngModel]="password()" (ngModelChange)="password.set($event)" autocomplete="current-password" required />
					</label>
					@if (error()) {
						<p class="rounded-lg border-l-4 border-[#d64535] bg-[#fdeeec] px-3 py-2 text-[#8a2418]" role="alert">{{ error() }}</p>
					}
					<div class="flex gap-3">
						<button type="submit" class="flex-1 rounded-xl bg-[#00706a] px-4 py-3 font-semibold text-white hover:bg-[#00605a] disabled:opacity-60" [disabled]="busy()">{{ busy() ? 'Loggar in…' : 'Logga in' }}</button>
						<button type="button" class="rounded-xl border border-[#d5e0e0] px-4 py-3 font-semibold text-[#4a5d5d] hover:bg-[#f6faf9]" (click)="close()">Avbryt</button>
					</div>
				</form>
			</div>
		}
	`,
})
export class ButikLoginComponent {
	readonly store = inject(ButikStore);
	readonly identifier = signal('');
	readonly password = signal('');
	readonly error = signal('');
	readonly busy = signal(false);

	close(): void {
		this.store.loginOpen.set(false);
		this.error.set('');
		this.password.set('');
	}

	async submit(): Promise<void> {
		if (this.busy() || !this.identifier().trim() || !this.password()) return;
		this.busy.set(true);
		this.error.set('');
		try {
			await this.store.login(this.identifier(), this.password());
			this.password.set('');
		} catch (e) {
			const status = (e as { status?: number }).status;
			this.error.set(
				status === 401 || status === 400
					? 'Fel e-post, mobilnummer eller lösenord.'
					: 'Det gick inte att logga in just nu. Försök igen om en stund.',
			);
		} finally {
			this.busy.set(false);
		}
	}
}

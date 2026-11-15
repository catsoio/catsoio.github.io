import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Varans bild, eller en ren bildyta med en ikon för kategorin när bilden saknas. */
@Component({
	selector: 'app-butik-visual',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br from-[#f6faf9] to-[#e3efee]">
			@if (image()) {
				<img [src]="image()" [alt]="name()" loading="lazy" class="h-full w-full object-contain p-4" />
			} @else {
				<svg viewBox="0 0 120 120" class="h-1/2 w-1/2 text-[#00706a]" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
					@switch (category()) {
						@case ('printer') {
							<rect x="22" y="40" width="76" height="40" rx="6" />
							<rect x="34" y="22" width="52" height="22" rx="3" />
							<rect x="34" y="62" width="52" height="30" rx="3" fill="#fff" />
							<path d="M42 72h36M42 80h24" />
						}
						@case ('supplies') {
							<circle cx="52" cy="58" r="30" />
							<circle cx="52" cy="58" r="11" fill="#fff" />
							<path d="M62 84h38a4 4 0 0 0 4-4V50" fill="none" />
							<rect x="66" y="78" width="40" height="14" rx="2" fill="#fff" />
						}
						@case ('scanner') {
							<path d="M34 28h42a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H62l-6 34a6 6 0 0 1-6 5h-6a4 4 0 0 1-4-5l8-34h-8a8 8 0 0 1-8-8V36a8 8 0 0 1 8-8z" />
							<path d="M92 40l14-6M92 48h16M92 56l14 6" fill="none" />
						}
						@case ('terminal') {
							<rect x="34" y="18" width="52" height="84" rx="8" />
							<rect x="42" y="28" width="36" height="22" rx="3" fill="#fff" />
							<path d="M44 62h8M56 62h8M68 62h8M44 74h8M56 74h8M68 74h8M44 86h8M56 86h8M68 86h8" fill="none" />
						}
						@default {
							<rect x="28" y="36" width="64" height="48" rx="6" />
							<path d="M28 52h64" fill="none" />
						}
					}
				</svg>
			}
		</div>
	`,
})
export class ButikVisualComponent {
	readonly image = input<string | null>(null);
	readonly category = input<string>('other');
	readonly name = input<string>('');
}

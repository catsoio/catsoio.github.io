// src/main.server.ts
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { appServerConfig } from './app/app.server.config';

export default function bootstrap(context: BootstrapContext) {
	return bootstrapApplication(
		AppComponent,
		appServerConfig,
		context // IMPORTANT: pass the BootstrapContext on the server
	);
}

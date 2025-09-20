import { Component } from '@angular/core';
import { PipeExplainComponent } from "../vera/pipe-explain/pipe-explain.component";

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [PipeExplainComponent],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiPromptDemoComponent } from './ai-prompt-demo.component';

describe('AiPromptDemoComponent', () => {
  let component: AiPromptDemoComponent;
  let fixture: ComponentFixture<AiPromptDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPromptDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiPromptDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

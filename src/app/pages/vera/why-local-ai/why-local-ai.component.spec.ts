import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyLocalAiComponent } from './why-local-ai.component';

describe('WhyLocalAiComponent', () => {
  let component: WhyLocalAiComponent;
  let fixture: ComponentFixture<WhyLocalAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyLocalAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyLocalAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

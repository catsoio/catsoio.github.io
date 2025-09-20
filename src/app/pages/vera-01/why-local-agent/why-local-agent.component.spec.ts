import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyLocalAgentComponent } from './why-local-agent.component';

describe('WhyLocalAgentComponent', () => {
  let component: WhyLocalAgentComponent;
  let fixture: ComponentFixture<WhyLocalAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyLocalAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyLocalAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

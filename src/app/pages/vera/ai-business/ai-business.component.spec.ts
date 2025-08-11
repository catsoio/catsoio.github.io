import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiBusinessComponent } from './ai-business.component';

describe('AiBusinessComponent', () => {
  let component: AiBusinessComponent;
  let fixture: ComponentFixture<AiBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowVeraThinkComponent } from './how-vera-think.component';

describe('HowVeraThinkComponent', () => {
  let component: HowVeraThinkComponent;
  let fixture: ComponentFixture<HowVeraThinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowVeraThinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowVeraThinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

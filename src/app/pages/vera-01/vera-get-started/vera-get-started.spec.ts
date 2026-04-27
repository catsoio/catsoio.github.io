import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeraGetStarted } from './vera-get-started';

describe('VeraGetStarted', () => {
  let component: VeraGetStarted;
  let fixture: ComponentFixture<VeraGetStarted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeraGetStarted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeraGetStarted);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

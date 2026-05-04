import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Faq } from './vera-01-faq';

describe('Vera01Faq', () => {
  let component: Vera01Faq;
  let fixture: ComponentFixture<Vera01Faq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Faq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Faq);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

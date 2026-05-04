import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Demo } from './vera-01-demo';

describe('Vera01Demo', () => {
  let component: Vera01Demo;
  let fixture: ComponentFixture<Vera01Demo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Demo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Demo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

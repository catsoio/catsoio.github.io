import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01 } from './vera-01';

describe('Vera01', () => {
  let component: Vera01;
  let fixture: ComponentFixture<Vera01>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

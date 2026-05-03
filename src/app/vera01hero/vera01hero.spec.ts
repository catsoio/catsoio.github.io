import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01hero } from './vera01hero';

describe('Vera01hero', () => {
  let component: Vera01hero;
  let fixture: ComponentFixture<Vera01hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01hero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

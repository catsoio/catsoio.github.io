import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Hero } from './vera-01-hero';

describe('Vera01Hero', () => {
  let component: Vera01Hero;
  let fixture: ComponentFixture<Vera01Hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Hero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

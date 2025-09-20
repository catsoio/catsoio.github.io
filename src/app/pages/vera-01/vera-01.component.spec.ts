import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Component } from './vera-01.component';

describe('Vera01Component', () => {
  let component: Vera01Component;
  let fixture: ComponentFixture<Vera01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

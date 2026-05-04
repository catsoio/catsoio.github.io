import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Banner } from './vera-01-banner';

describe('Vera01Banner', () => {
  let component: Vera01Banner;
  let fixture: ComponentFixture<Vera01Banner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Banner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Banner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

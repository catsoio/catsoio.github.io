import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Landing } from './vera-01-landing';

describe('Vera01Landing', () => {
  let component: Vera01Landing;
  let fixture: ComponentFixture<Vera01Landing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Landing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Landing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

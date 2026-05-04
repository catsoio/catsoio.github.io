import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Showcase } from './vera-01-showcase';

describe('Vera01Showcase', () => {
  let component: Vera01Showcase;
  let fixture: ComponentFixture<Vera01Showcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Showcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Showcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

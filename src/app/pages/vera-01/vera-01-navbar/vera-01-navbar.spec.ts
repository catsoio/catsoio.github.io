import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Navbar } from './vera-01-navbar';

describe('Vera01Navbar', () => {
  let component: Vera01Navbar;
  let fixture: ComponentFixture<Vera01Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Navbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

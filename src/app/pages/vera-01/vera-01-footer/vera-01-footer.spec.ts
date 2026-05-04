import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Footer } from './vera-01-footer';

describe('Vera01Footer', () => {
  let component: Vera01Footer;
  let fixture: ComponentFixture<Vera01Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Footer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

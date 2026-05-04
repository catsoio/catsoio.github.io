import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Contact } from './vera-01-contact';

describe('Vera01Contact', () => {
  let component: Vera01Contact;
  let fixture: ComponentFixture<Vera01Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Contact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

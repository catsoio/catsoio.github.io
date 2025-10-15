import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDeleteAccount } from './request-delete-account';

describe('RequestDeleteAccount', () => {
  let component: RequestDeleteAccount;
  let fixture: ComponentFixture<RequestDeleteAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDeleteAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDeleteAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

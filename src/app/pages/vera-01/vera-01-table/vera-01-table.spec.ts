import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Table } from './vera-01-table';

describe('Vera01Table', () => {
  let component: Vera01Table;
  let fixture: ComponentFixture<Vera01Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Table]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Table);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowVeraWorksComponent } from './how-vera-works.component';

describe('HowVeraWorksComponent', () => {
  let component: HowVeraWorksComponent;
  let fixture: ComponentFixture<HowVeraWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowVeraWorksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowVeraWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

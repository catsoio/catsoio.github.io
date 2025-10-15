import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HemmafestComponent } from './hemmafest.component';

describe('HemmafestComponent', () => {
  let component: HemmafestComponent;
  let fixture: ComponentFixture<HemmafestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HemmafestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HemmafestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

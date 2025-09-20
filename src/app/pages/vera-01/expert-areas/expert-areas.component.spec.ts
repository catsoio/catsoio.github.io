import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertAreasComponent } from './expert-areas.component';

describe('ExpertAreasComponent', () => {
  let component: ExpertAreasComponent;
  let fixture: ComponentFixture<ExpertAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertAreasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

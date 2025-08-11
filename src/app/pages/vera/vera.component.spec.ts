import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeraComponent } from './vera.component';

describe('VeraComponent', () => {
  let component: VeraComponent;
  let fixture: ComponentFixture<VeraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeExplainComponent } from './pipe-explain.component';

describe('PipeExplainComponent', () => {
  let component: PipeExplainComponent;
  let fixture: ComponentFixture<PipeExplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipeExplainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipeExplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

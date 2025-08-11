import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReviewComponent } from './document-review.component';

describe('DocumentReviewComponent', () => {
  let component: DocumentReviewComponent;
  let fixture: ComponentFixture<DocumentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

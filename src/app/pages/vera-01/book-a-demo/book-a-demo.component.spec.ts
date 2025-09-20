import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookADemoComponent } from './book-a-demo.component';

describe('BookADemoComponent', () => {
  let component: BookADemoComponent;
  let fixture: ComponentFixture<BookADemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookADemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookADemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

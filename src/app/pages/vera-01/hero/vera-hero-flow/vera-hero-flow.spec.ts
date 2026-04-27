import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeraHeroFlow } from './vera-hero-flow';

describe('VeraHeroFlow', () => {
  let component: VeraHeroFlow;
  let fixture: ComponentFixture<VeraHeroFlow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeraHeroFlow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeraHeroFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

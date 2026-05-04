import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vera01Workspaces } from './vera-01-workspaces';

describe('Vera01Workspaces', () => {
  let component: Vera01Workspaces;
  let fixture: ComponentFixture<Vera01Workspaces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vera01Workspaces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vera01Workspaces);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

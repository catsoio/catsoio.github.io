import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellWorkspacesComponent } from './modell-workspaces.component';

describe('ModellWorkspacesComponent', () => {
  let component: ModellWorkspacesComponent;
  let fixture: ComponentFixture<ModellWorkspacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModellWorkspacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModellWorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

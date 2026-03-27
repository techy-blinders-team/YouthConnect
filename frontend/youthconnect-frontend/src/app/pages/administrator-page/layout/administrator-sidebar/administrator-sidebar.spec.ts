import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorSidebar } from './administrator-sidebar';

describe('AdministratorSidebar', () => {
  let component: AdministratorSidebar;
  let fixture: ComponentFixture<AdministratorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

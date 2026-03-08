import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorDashboard } from './administrator-dashboard';

describe('AdministratorDashboard', () => {
  let component: AdministratorDashboard;
  let fixture: ComponentFixture<AdministratorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

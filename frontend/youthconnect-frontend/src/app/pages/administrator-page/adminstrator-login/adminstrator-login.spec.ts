import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstratorLogin } from './adminstrator-login';

describe('AdminstratorLogin', () => {
  let component: AdminstratorLogin;
  let fixture: ComponentFixture<AdminstratorLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminstratorLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminstratorLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

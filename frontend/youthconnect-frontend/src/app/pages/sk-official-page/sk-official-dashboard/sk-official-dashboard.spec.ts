import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficialDashboard } from './sk-official-dashboard';

describe('SkOfficialDashboard', () => {
  let component: SkOfficialDashboard;
  let fixture: ComponentFixture<SkOfficialDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficialDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficialDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

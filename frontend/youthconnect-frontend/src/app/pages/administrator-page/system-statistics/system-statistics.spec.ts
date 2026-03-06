import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemStatistics } from './system-statistics';

describe('SystemStatistics', () => {
  let component: SystemStatistics;
  let fixture: ComponentFixture<SystemStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemStatistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemStatistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

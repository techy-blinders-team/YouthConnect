import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemControl } from './system-control';

describe('SystemControl', () => {
  let component: SystemControl;
  let fixture: ComponentFixture<SystemControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

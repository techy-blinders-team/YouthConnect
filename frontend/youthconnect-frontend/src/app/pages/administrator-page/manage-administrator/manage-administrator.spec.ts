import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdministrator } from './manage-administrator';

describe('ManageAdministrator', () => {
  let component: ManageAdministrator;
  let fixture: ComponentFixture<ManageAdministrator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAdministrator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAdministrator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

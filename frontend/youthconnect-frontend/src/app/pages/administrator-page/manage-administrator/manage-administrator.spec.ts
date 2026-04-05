import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ManageAdministrator } from './manage-administrator';
import { AdministratorManagementService } from '../../../services/administrator-management.service';

describe('ManageAdministrator', () => {
  let component: ManageAdministrator;
  let fixture: ComponentFixture<ManageAdministrator>;

  beforeEach(async () => {
    const administratorManagementServiceStub = {
      getAdministrators: () => of([]),
      updateAdministratorStatus: () => of()
    };

    await TestBed.configureTestingModule({
      imports: [ManageAdministrator],
      providers: [
        {
          provide: AdministratorManagementService,
          useValue: administratorManagementServiceStub
        }
      ]
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

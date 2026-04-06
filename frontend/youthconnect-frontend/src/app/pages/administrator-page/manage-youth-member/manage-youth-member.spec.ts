import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ManageYouthMember } from './manage-youth-member';
import { YouthMemberManagementService } from '../../../services/youth-member-management.service';

describe('ManageYouthMember', () => {
  let component: ManageYouthMember;
  let fixture: ComponentFixture<ManageYouthMember>;

  beforeEach(async () => {
    const youthMemberManagementServiceStub = {
      getUsers: () => of([]),
      getYouthProfiles: () => of([]),
      updateUser: () => of(),
      updateYouthProfile: () => of(),
      deleteYouthProfile: () => of()
    };

    await TestBed.configureTestingModule({
      imports: [ManageYouthMember],
      providers: [
        {
          provide: YouthMemberManagementService,
          useValue: youthMemberManagementServiceStub
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageYouthMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

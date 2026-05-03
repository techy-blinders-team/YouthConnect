import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ManageYouthMember } from './manage-youth-member';
import { YouthMemberManagementService } from '../../../services/youth-member-management.service';
import { UserApprovalService } from '../../../services/user-approval.service';

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

    const userApprovalServiceStub = {
      getPendingUsers: () => of([]),
      getApprovedUsers: () => of([]),
      getRejectedUsers: () => of([]),
      approveUser: () => of({}),
      rejectUser: () => of({})
    };

    await TestBed.configureTestingModule({
      imports: [ManageYouthMember],
      providers: [
        {
          provide: YouthMemberManagementService,
          useValue: youthMemberManagementServiceStub
        },
        {
          provide: UserApprovalService,
          useValue: userApprovalServiceStub
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

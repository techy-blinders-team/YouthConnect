import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageYouthMember } from './manage-youth-member';

describe('ManageYouthMember', () => {
  let component: ManageYouthMember;
  let fixture: ComponentFixture<ManageYouthMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageYouthMember]
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

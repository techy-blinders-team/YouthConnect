import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditYouthMemberFeature } from './edit-youth-member-feature';

describe('EditYouthMemberFeature', () => {
  let component: EditYouthMemberFeature;
  let fixture: ComponentFixture<EditYouthMemberFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditYouthMemberFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditYouthMemberFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

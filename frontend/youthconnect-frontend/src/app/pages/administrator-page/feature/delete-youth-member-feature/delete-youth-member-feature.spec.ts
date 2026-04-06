import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteYouthMemberFeature } from './delete-youth-member-feature';

describe('DeleteYouthMemberFeature', () => {
  let component: DeleteYouthMemberFeature;
  let fixture: ComponentFixture<DeleteYouthMemberFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteYouthMemberFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteYouthMemberFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

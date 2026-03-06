import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSkOfficials } from './manage-sk-officials';

describe('ManageSkOfficials', () => {
  let component: ManageSkOfficials;
  let fixture: ComponentFixture<ManageSkOfficials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSkOfficials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSkOfficials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

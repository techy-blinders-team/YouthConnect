import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdministratorFeature } from './edit-administrator-feature';

describe('EditAdministratorFeature', () => {
  let component: EditAdministratorFeature;
  let fixture: ComponentFixture<EditAdministratorFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdministratorFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdministratorFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

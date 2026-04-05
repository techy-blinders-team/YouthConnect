import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdministratorFeature } from './add-administrator-feature';

describe('AddAdministratorFeature', () => {
  let component: AddAdministratorFeature;
  let fixture: ComponentFixture<AddAdministratorFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdministratorFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdministratorFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

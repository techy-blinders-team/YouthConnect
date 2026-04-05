import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdministratorFeature } from './delete-administrator-feature';

describe('DeleteAdministratorFeature', () => {
  let component: DeleteAdministratorFeature;
  let fixture: ComponentFixture<DeleteAdministratorFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAdministratorFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAdministratorFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

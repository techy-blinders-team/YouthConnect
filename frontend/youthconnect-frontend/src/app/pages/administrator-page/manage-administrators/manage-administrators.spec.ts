import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdministrators } from './manage-administrators';

describe('ManageAdministrators', () => {
  let component: ManageAdministrators;
  let fixture: ComponentFixture<ManageAdministrators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAdministrators]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAdministrators);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

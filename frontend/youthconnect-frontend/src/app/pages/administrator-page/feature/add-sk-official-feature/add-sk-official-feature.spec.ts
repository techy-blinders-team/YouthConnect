import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkOfficialFeature } from './add-sk-official-feature';

describe('AddSkOfficialFeature', () => {
  let component: AddSkOfficialFeature;
  let fixture: ComponentFixture<AddSkOfficialFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSkOfficialFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSkOfficialFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

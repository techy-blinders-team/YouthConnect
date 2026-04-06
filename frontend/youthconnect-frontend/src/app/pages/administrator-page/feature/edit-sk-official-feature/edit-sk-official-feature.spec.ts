import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkOfficialFeature } from './edit-sk-official-feature';

describe('EditSkOfficialFeature', () => {
  let component: EditSkOfficialFeature;
  let fixture: ComponentFixture<EditSkOfficialFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSkOfficialFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSkOfficialFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

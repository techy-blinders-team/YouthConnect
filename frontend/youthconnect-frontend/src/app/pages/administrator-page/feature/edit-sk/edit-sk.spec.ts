import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSk } from './edit-sk';

describe('EditSk', () => {
  let component: EditSk;
  let fixture: ComponentFixture<EditSk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

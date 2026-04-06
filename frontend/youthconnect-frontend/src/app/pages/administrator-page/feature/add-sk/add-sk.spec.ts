import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSk } from './add-sk';

describe('AddSk', () => {
  let component: AddSk;
  let fixture: ComponentFixture<AddSk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

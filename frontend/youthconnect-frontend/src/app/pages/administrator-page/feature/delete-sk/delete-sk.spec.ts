import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSk } from './delete-sk';

describe('DeleteSk', () => {
  let component: DeleteSk;
  let fixture: ComponentFixture<DeleteSk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

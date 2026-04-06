import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSkOfficialFeature } from './delete-sk-official-feature';

describe('DeleteSkOfficialFeature', () => {
  let component: DeleteSkOfficialFeature;
  let fixture: ComponentFixture<DeleteSkOfficialFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSkOfficialFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSkOfficialFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

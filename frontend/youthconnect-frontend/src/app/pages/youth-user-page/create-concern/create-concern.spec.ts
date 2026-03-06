import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConcern } from './create-concern';

describe('CreateConcern', () => {
  let component: CreateConcern;
  let fixture: ComponentFixture<CreateConcern>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateConcern]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateConcern);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

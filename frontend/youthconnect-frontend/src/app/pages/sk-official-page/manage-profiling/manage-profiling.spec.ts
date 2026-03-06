import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfiling } from './manage-profiling';

describe('ManageProfiling', () => {
  let component: ManageProfiling;
  let fixture: ComponentFixture<ManageProfiling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProfiling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProfiling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

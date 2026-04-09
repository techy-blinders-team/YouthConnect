import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouthProfiling } from './youth-profiling';

describe('YouthProfiling', () => {
  let component: YouthProfiling;
  let fixture: ComponentFixture<YouthProfiling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YouthProfiling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YouthProfiling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

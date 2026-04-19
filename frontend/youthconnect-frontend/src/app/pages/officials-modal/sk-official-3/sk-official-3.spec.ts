import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial3 } from './sk-official-3';

describe('SkOfficial3', () => {
  let component: SkOfficial3;
  let fixture: ComponentFixture<SkOfficial3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial5 } from './sk-official-5';

describe('SkOfficial5', () => {
  let component: SkOfficial5;
  let fixture: ComponentFixture<SkOfficial5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

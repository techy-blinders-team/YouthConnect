import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial6 } from './sk-official-6';

describe('SkOfficial6', () => {
  let component: SkOfficial6;
  let fixture: ComponentFixture<SkOfficial6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

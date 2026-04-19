import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial7 } from './sk-official-7';

describe('SkOfficial7', () => {
  let component: SkOfficial7;
  let fixture: ComponentFixture<SkOfficial7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

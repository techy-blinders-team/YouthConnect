import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial1 } from './sk-official-1';

describe('SkOfficial1', () => {
  let component: SkOfficial1;
  let fixture: ComponentFixture<SkOfficial1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial8 } from './sk-official-8';

describe('SkOfficial8', () => {
  let component: SkOfficial8;
  let fixture: ComponentFixture<SkOfficial8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

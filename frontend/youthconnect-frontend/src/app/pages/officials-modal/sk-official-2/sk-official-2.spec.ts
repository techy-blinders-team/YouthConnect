import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial2 } from './sk-official-2';

describe('SkOfficial2', () => {
  let component: SkOfficial2;
  let fixture: ComponentFixture<SkOfficial2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

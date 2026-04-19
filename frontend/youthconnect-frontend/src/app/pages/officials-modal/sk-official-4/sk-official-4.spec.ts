import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficial4 } from './sk-official-4';

describe('SkOfficial4', () => {
  let component: SkOfficial4;
  let fixture: ComponentFixture<SkOfficial4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficial4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficial4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

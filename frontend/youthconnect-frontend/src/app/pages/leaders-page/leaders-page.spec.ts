import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadersPage } from './leaders-page';

describe('LeadersPage', () => {
  let component: LeadersPage;
  let fixture: ComponentFixture<LeadersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

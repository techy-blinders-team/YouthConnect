import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadersLandingPage } from './leaders-landing-page';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('LeadersLandingPage', () => {
  let component: LeadersLandingPage;
  let fixture: ComponentFixture<LeadersLandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadersLandingPage],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadersLandingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

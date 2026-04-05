import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AdministratorLayout } from './administrator-layout';

describe('AdministratorLayout', () => {
  let component: AdministratorLayout;
  let fixture: ComponentFixture<AdministratorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorLayout],
      providers: [provideRouter([]), provideHttpClient()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdministratorLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

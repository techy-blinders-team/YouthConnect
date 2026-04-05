import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AdministratorSidebar } from './administrator-sidebar';

describe('AdministratorSidebar', () => {
  let component: AdministratorSidebar;
  let fixture: ComponentFixture<AdministratorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorSidebar],
      providers: [provideRouter([]), provideHttpClient()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdministratorSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

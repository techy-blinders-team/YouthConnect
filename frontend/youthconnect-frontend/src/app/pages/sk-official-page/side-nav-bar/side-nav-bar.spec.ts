import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SideNavBar } from './side-nav-bar';

describe('SideNavBar', () => {
  let component: SideNavBar;
  let fixture: ComponentFixture<SideNavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavBar, RouterTestingModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SideNavBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

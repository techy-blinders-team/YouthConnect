import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkOfficialLogin } from './sk-official-login';

describe('SkOfficialLogin', () => {
  let component: SkOfficialLogin;
  let fixture: ComponentFixture<SkOfficialLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkOfficialLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkOfficialLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

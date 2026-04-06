import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ManageSkOfficials } from './manage-sk-officials';
import { SkOfficialManagementService } from '../../../services/sk-official-management.service';

describe('ManageSkOfficials', () => {
  let component: ManageSkOfficials;
  let fixture: ComponentFixture<ManageSkOfficials>;

  beforeEach(async () => {
    const skOfficialManagementServiceStub = {
      getSkOfficials: () => of([]),
      createSkOfficial: () => of(),
      updateSkOfficial: () => of(),
      deleteSkOfficial: () => of()
    };

    await TestBed.configureTestingModule({
      imports: [ManageSkOfficials],
      providers: [
        {
          provide: SkOfficialManagementService,
          useValue: skOfficialManagementServiceStub
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSkOfficials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

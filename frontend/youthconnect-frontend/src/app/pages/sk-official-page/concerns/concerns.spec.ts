import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Concerns } from './concerns';
import { AuthService } from '../../../services/auth.service';
import { AdminConcernService } from '../../../services/admin-concern.service';
import { SkOfficialManagementService } from '../../../services/sk-official-management.service';

describe('Concerns', () => {
  let component: Concerns;
  let fixture: ComponentFixture<Concerns>;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  const mockConcerns = [
    {
      concernId: 1,
      youthId: 18,
      typeOfConcern: 'PROJECT_CONCERN' as const,
      title: 'Issue with the project',
      description: 'Detailed description of the concern here.',
      status: 'OPEN' as const,
      createdAt: '2026-03-21T14:14:03',
      updatedAt: null as any
    },
    {
      concernId: 2,
      youthId: 19,
      typeOfConcern: 'COMMUNITY_CONCERN' as const,
      title: 'Community issue',
      description: 'This is a community concern description.',
      status: 'IN_PROGRESS' as const,
      createdAt: '2026-03-22T10:30:00',
      updatedAt: '2026-03-22T11:00:00'
    }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceSpy.getCurrentUser.and.returnValue({
      adminId: 1,
      email: 'johndoe@gmail.com',
      role: 'sk-official'
    });

    await TestBed.configureTestingModule({
      imports: [Concerns, HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        AdminConcernService,
        SkOfficialManagementService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(Concerns);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty concerns', () => {
    expect(component.concerns.length).toBe(0);
    expect(component.filteredConcerns.length).toBe(0);
    expect(component.isResponseModalOpen).toBeFalse();
  });

  it('should load concerns on init', () => {
    const mockSkOfficials = [
      {
        adminId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        isActive: true
      }
    ];

    component.ngOnInit();
    
    // Mock the SK Officials request (uses relative URL)
    const skOfficialsReq = httpMock.expectOne('/api/administrator/sk-officials');
    expect(skOfficialsReq.request.method).toBe('GET');
    skOfficialsReq.flush(mockSkOfficials);

    // Mock the concerns request (uses absolute URL)
    const concernsReq = httpMock.expectOne('http://localhost:8080/api/admin/concerns');
    expect(concernsReq.request.method).toBe('GET');
    concernsReq.flush(mockConcerns);

    expect(component.concerns.length).toBe(2);
    expect(component.filteredConcerns.length).toBe(2);
  });

  it('should search concerns by title', () => {
    component.concerns = mockConcerns;
    component.filteredConcerns = mockConcerns;
    
    component.searchConcerns('project');
    
    expect(component.filteredConcerns.length).toBe(1);
    expect(component.filteredConcerns[0].concernId).toBe(1);
  });

  it('should search concerns by description', () => {
    component.concerns = mockConcerns;
    component.filteredConcerns = mockConcerns;
    
    component.searchConcerns('community');
    
    expect(component.filteredConcerns.length).toBe(1);
    expect(component.filteredConcerns[0].concernId).toBe(2);
  });

  it('should open response modal with concern', () => {
    component.openResponseModal(mockConcerns[0]);

    expect(component.isResponseModalOpen).toBeTrue();
    expect(component.selectedConcern).toEqual(mockConcerns[0]);
  });

  it('should close response modal', () => {
    component.isResponseModalOpen = true;
    component.closeResponseModal();

    expect(component.isResponseModalOpen).toBeFalse();
  });

  it('should send response successfully', () => {
    component.selectedConcern = mockConcerns[0];
    component.currentAdminId = 1;
    component.responseForm.patchValue({
      response: 'This is a detailed admin response to the concern.',
      status: 'IN_PROGRESS'
    });

    component.sendResponse();

    const req = httpMock.expectOne('http://localhost:8080/api/admin/concerns/1/updates');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.updateText).toBe('This is a detailed admin response to the concern.');
    
    req.flush('Success', { status: 201, statusText: 'Created' });
  });

  it('should display concern type correctly', () => {
    expect(component.getConcernTypeDisplay('PROJECT_CONCERN')).toBe('Project Concern');
    expect(component.getConcernTypeDisplay('COMMUNITY_CONCERN')).toBe('Community Concern');
    expect(component.getConcernTypeDisplay('SYSTEM_CONCERN')).toBe('System Concern');
  });

  it('should format date correctly', () => {
    const formatted = component.formatDate('2026-03-21T14:14:03');
    expect(formatted).toContain('Mar');
    expect(formatted).toContain('21');
  });
});

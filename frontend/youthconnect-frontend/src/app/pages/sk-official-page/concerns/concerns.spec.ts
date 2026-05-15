import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Concerns } from './concerns';
import { AuthService } from '../../../services/auth.service';
import { AdminConcernService } from '../../../services/admin-concern.service';
import { SkOfficialManagementService } from '../../../services/sk-official-management.service';

describe('Concerns', () => {
  let component: Concerns;
  let fixture: ComponentFixture<Concerns>;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

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

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Concerns, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AdminConcernService,
        SkOfficialManagementService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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

    // Mock the concerns request (uses environment-based URL)
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

  it('should navigate to update concern page', () => {
    component.updateConcern(mockConcerns[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/sk-official/concerns/update', 1]);
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

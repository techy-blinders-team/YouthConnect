import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AdminConcernService, Concern, ConcernUpdate, AdminConcernUpdateRequest } from '../../../services/admin-concern.service';
import { SkOfficialManagementService } from '../../../services/sk-official-management.service';

@Component({
  selector: 'app-concerns',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './concerns.html',
  styleUrl: './concerns.scss',
})
export class Concerns implements OnInit {
  isResponseModalOpen = false;
  responseForm!: FormGroup;
  concerns: Concern[] = [];
  filteredConcerns: Concern[] = [];
  concernUpdates: ConcernUpdate[] = [];
  isLoading = false;
  isLoadingUpdates = false;
  errorMessage: string = '';
  successMessage: string = '';
  updateLoadError: string = '';
  searchTerm: string = '';
  currentAdminId: number = 0;
  selectedConcern: Concern | null = null;
  statusOptions: { value: Concern['status']; label: string }[] = [];
  skOfficialName = 'SK Official';
  skOfficialEmail = '';
  skOfficialPosition = 'SK Official';
  skOfficialInitials = 'SK';

  constructor(
    private adminConcernService: AdminConcernService,
    private fb: FormBuilder,
    private authService: AuthService,
    private skOfficialService: SkOfficialManagementService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.loadSkOfficialProfile();
    this.loadConcerns();
  }

  initForm() {
    this.responseForm = this.fb.group({
      response: ['', [Validators.required, Validators.minLength(10)]],
      status: ['IN_PROGRESS', Validators.required]
    });
  }

  getCurrentUser() {
    const user = this.authService.getCurrentUser() as any;
    if (user && user.adminId) {
      this.currentAdminId = user.adminId;
      localStorage.setItem('adminId', user.adminId.toString());
    }

    if (!this.currentAdminId) {
      const storedAdminId = localStorage.getItem('sk_official_id') || localStorage.getItem('adminId');
      this.currentAdminId = storedAdminId ? Number(storedAdminId) : 0;
    }
  }

  loadSkOfficialProfile() {
    const fallbackName = localStorage.getItem('sk_official_name') || 'SK Official';
    const fallbackEmail = localStorage.getItem('sk_official_email') || '';
    const currentAdminId = Number(localStorage.getItem('sk_official_id') || localStorage.getItem('adminId'));

    this.skOfficialName = fallbackName;
    this.skOfficialEmail = fallbackEmail;
    this.skOfficialInitials = this.getInitials(fallbackName);

    this.skOfficialService.getSkOfficials().subscribe({
      next: (officials) => {
        const matched = officials.find((official) => official.adminId === currentAdminId)
          || officials.find((official) => official.email === fallbackEmail);

        if (!matched) {
          return;
        }

        this.skOfficialName = `${matched.firstName} ${matched.lastName}`.trim();
        this.skOfficialEmail = matched.email;
        this.skOfficialInitials = this.getInitials(this.skOfficialName);
        localStorage.setItem('sk_official_name', this.skOfficialName);
        localStorage.setItem('sk_official_email', matched.email);
      },
      error: (error) => {
        console.error('Error loading SK Official profile:', error);
      }
    });
  }

  getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) {
      return 'SK';
    }
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  loadConcerns() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminConcernService.getAllConcerns().subscribe({
      next: (data) => {
        this.concerns = data;
        this.filteredConcerns = data;
        this.searchTerm = '';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading concerns:', error);
        this.errorMessage = 'Failed to load concerns. Please try again.';
        this.isLoading = false;
      }
    });
  }

  searchConcerns(term: string) {
    this.searchTerm = term;
    
    if (!term.trim()) {
      this.filteredConcerns = this.concerns;
      return;
    }

    const searchLower = term.toLowerCase();
    this.filteredConcerns = this.concerns.filter(concern =>
      concern.title.toLowerCase().includes(searchLower) ||
      concern.description.toLowerCase().includes(searchLower) ||
      concern.typeOfConcern.toLowerCase().includes(searchLower)
    );
  }

  openResponseModal(concern: Concern) {
    this.selectedConcern = concern;
    this.isResponseModalOpen = true;
    this.statusOptions = this.buildStatusOptions(concern.status);
    this.responseForm.reset({
      response: '',
      status: this.getDefaultStatus(concern.status)
    });
    this.loadConcernUpdates(concern.concernId);
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeResponseModal() {
    this.isResponseModalOpen = false;
    this.selectedConcern = null;
    this.responseForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.concernUpdates = [];
    this.updateLoadError = '';
  }

  sendResponse() {
    this.responseForm.markAllAsTouched();

    if (this.responseForm.invalid || !this.selectedConcern) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (!this.currentAdminId) {
      this.errorMessage = 'User information not found';
      return;
    }

    const formValue = this.responseForm.value;
    const request: AdminConcernUpdateRequest = {
      adminId: this.currentAdminId,
      updateText: formValue.response,
      status: formValue.status
    };

    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminConcernService.addConcernUpdate(this.selectedConcern.concernId, request).subscribe({
      next: () => {
        this.successMessage = 'Response sent and status updated successfully!';
        this.responseForm.reset();
        this.loadConcernUpdates(this.selectedConcern!.concernId);
        setTimeout(() => {
          this.closeResponseModal();
          this.loadConcerns();
        }, 1000);
      },
      error: (error) => {
        console.error('Error sending response:', error);
        this.errorMessage = error.error || 'Failed to send response. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getConcernTypeDisplay(type: string): string {
    const typeMap: { [key: string]: string } = {
      'PROJECT_CONCERN': 'Project Concern',
      'COMMUNITY_CONCERN': 'Community Concern',
      'SYSTEM_CONCERN': 'System Concern'
    };
    return typeMap[type] || type;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace('_', '-');
  }

  getStatusLabel(status: Concern['status']): string {
    const labelMap: Record<Concern['status'], string> = {
      OPEN: 'Open',
      IN_PROGRESS: 'In Progress',
      RESOLVED: 'Resolved',
      CLOSED: 'Closed'
    };
    return labelMap[status] || status;
  }

  private getDefaultStatus(status?: Concern['status']): Concern['status'] {
    if (status === 'OPEN') {
      return 'IN_PROGRESS';
    }
    return status || 'IN_PROGRESS';
  }

  private buildStatusOptions(status?: Concern['status']): { value: Concern['status']; label: string }[] {
    switch (status) {
      case 'OPEN':
        return [{ value: 'IN_PROGRESS', label: 'In Progress' }];
      case 'IN_PROGRESS':
        return [
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'RESOLVED', label: 'Resolved' },
          { value: 'CLOSED', label: 'Closed' }
        ];
      case 'RESOLVED':
        return [
          { value: 'RESOLVED', label: 'Resolved' },
          { value: 'CLOSED', label: 'Closed' }
        ];
      case 'CLOSED':
        return [{ value: 'CLOSED', label: 'Closed' }];
      default:
        return [{ value: 'IN_PROGRESS', label: 'In Progress' }];
    }
  }

  loadConcernUpdates(concernId: number) {
    this.isLoadingUpdates = true;
    this.updateLoadError = '';

    this.adminConcernService.getConcernUpdates(concernId).subscribe({
      next: (updates) => {
        this.concernUpdates = updates;
        this.isLoadingUpdates = false;
      },
      error: (error) => {
        console.error('Error loading concern updates:', error);
        this.updateLoadError = 'Failed to load updates. Please try again.';
        this.isLoadingUpdates = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  canSendResponse(status: string): boolean {
    return status !== 'CLOSED';
  }
}



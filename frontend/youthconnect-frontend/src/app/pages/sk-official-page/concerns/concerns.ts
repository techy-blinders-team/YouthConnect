import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AdminConcernService, Concern, AdminConcernUpdateRequest } from '../../../services/admin-concern.service';

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
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  searchTerm: string = '';
  currentAdminId: number = 0;
  selectedConcern: Concern | null = null;

  constructor(
    private adminConcernService: AdminConcernService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getCurrentUser();
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
    }
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
    this.responseForm.reset({ status: concern.status || 'IN_PROGRESS' });
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeResponseModal() {
    this.isResponseModalOpen = false;
    this.selectedConcern = null;
    this.responseForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  sendResponse() {
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
}



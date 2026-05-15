import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  concerns: Concern[] = [];
  filteredConcerns: Concern[] = [];
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  searchTerm: string = '';
  currentAdminId: number = 0;
  skOfficialName = 'SK Official';
  skOfficialEmail = '';
  skOfficialPosition = 'SK Official';
  skOfficialInitials = 'SK';

  constructor(
    private adminConcernService: AdminConcernService,
    private authService: AuthService,
    private skOfficialService: SkOfficialManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCurrentUser();
    this.loadSkOfficialProfile();
    this.loadConcerns();
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

  updateConcern(concern: Concern) {
    this.router.navigate(['/sk-official/concerns/update', concern.concernId]);
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

  canSendResponse(status: string): boolean {
    return status !== 'CLOSED';
  }
}



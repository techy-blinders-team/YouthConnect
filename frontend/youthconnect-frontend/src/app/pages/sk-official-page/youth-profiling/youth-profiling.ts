import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { YouthMemberManagementService, YouthMemberListItem } from '../../../services/youth-member-management.service';
import { CivilStatus, Gender } from '../../../models/enums';

@Component({
  selector: 'app-youth-profiling',
  imports: [CommonModule, FormsModule],
  templateUrl: './youth-profiling.html',
  styleUrl: './youth-profiling.scss',
})
export class YouthProfiling implements OnInit {
  youthProfiles: YouthMemberListItem[] = [];
  filteredProfiles: YouthMemberListItem[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private youthMemberManagementService: YouthMemberManagementService) {}

  ngOnInit(): void {
    this.loadYouthProfiles();
  }

  loadYouthProfiles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.youthMemberManagementService.getYouthProfiles().subscribe({
      next: (data: any) => {
        // Transform the response to match YouthMemberListItem
        this.youthProfiles = data.map((profile: any) => ({
          userId: profile.userId || 0,
          youthId: profile.youthId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email || '',
          gender: profile.gender as Gender,
          birthday: profile.birthday,
          contactNumber: profile.contactNumber,
          civilStatus: profile.civilStatus as CivilStatus,
          isActive: profile.isActive !== undefined ? profile.isActive : true,
          isApprove: profile.isApprove || null,
          createdAt: profile.createdAt,
          middleName: profile.middleName || null,
          suffix: profile.suffix || null,
          completeAddress: profile.completeAddress
        }));
        this.filteredProfiles = [...this.youthProfiles];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading youth profiles:', error);
        this.errorMessage = 'Failed to load youth profiles. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredProfiles = [...this.youthProfiles];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredProfiles = this.youthProfiles.filter(profile =>
      profile.firstName.toLowerCase().includes(query) ||
      profile.lastName.toLowerCase().includes(query) ||
      (profile.middleName && profile.middleName.toLowerCase().includes(query)) ||
      profile.contactNumber.toLowerCase().includes(query) ||
      (profile.completeAddress && profile.completeAddress.toLowerCase().includes(query)) ||
      profile.civilStatus.toLowerCase().includes(query)
    );
  }

  exportToPDF(): void {
    // TODO: Implement PDF export functionality
    console.log('Exporting to PDF...');
    alert('PDF export functionality coming soon!');
  }

  exportToExcel(): void {
    // TODO: Implement Excel export functionality
    console.log('Exporting to Excel...');
    alert('Excel export functionality coming soon!');
  }

  getFullName(profile: YouthMemberListItem): string {
    const parts = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean);
    return parts.join(' ');
  }

  getAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
}

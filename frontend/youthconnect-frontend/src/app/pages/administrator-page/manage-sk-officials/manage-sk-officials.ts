import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CreateSkOfficialPayload,
  SkOfficialAccount,
  SkOfficialManagementService,
  UpdateSkOfficialPayload
} from '../../../services/sk-official-management.service';
import { AddSkOfficialFeature } from '../feature/add-sk-official-feature/add-sk-official-feature';
import { DeleteSkOfficialFeature } from '../feature/delete-sk-official-feature/delete-sk-official-feature';
import { EditSkOfficialFeature } from '../feature/edit-sk-official-feature/edit-sk-official-feature';

@Component({
  selector: 'app-manage-sk-officials',
  standalone: true,
  imports: [CommonModule, FormsModule, AddSkOfficialFeature, EditSkOfficialFeature, DeleteSkOfficialFeature],
  templateUrl: './manage-sk-officials.html',
  styleUrl: './manage-sk-officials.scss',
})
export class ManageSkOfficials implements OnInit {
  private skOfficialManagementService = inject(SkOfficialManagementService);

  skOfficials: SkOfficialAccount[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage: string | null = null;

  showAddModal = false;
  isCreatingSkOfficial = false;
  addSkOfficialErrorMessage: string | null = null;

  showEditModal = false;
  editingSkOfficial: SkOfficialAccount | null = null;
  isEditingSkOfficial = false;
  editSkOfficialErrorMessage: string | null = null;
  showEditSuccessModal = false;
  editSuccessMessage = '';

  showDeleteModal = false;
  deletingSkOfficial: SkOfficialAccount | null = null;
  isDeletingSkOfficial = false;
  deleteSkOfficialErrorMessage: string | null = null;
  showDeleteSuccessModal = false;
  deleteSuccessMessage = '';

  ngOnInit(): void {
    this.loadSkOfficials();
  }

  get filteredSkOfficials(): SkOfficialAccount[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) {
      return this.skOfficials;
    }

    return this.skOfficials.filter((skOfficial) => {
      const fullName = this.getFullName(skOfficial).toLowerCase();
      const statusText = this.getStatusLabel(this.getIsActive(skOfficial)).toLowerCase();
      return (
        String(skOfficial.adminId).includes(normalizedSearchTerm)
        || fullName.includes(normalizedSearchTerm)
        || (skOfficial.email ?? '').toLowerCase().includes(normalizedSearchTerm)
        || statusText.includes(normalizedSearchTerm)
      );
    });
  }

  getFullName(skOfficial: SkOfficialAccount): string {
    const firstName = skOfficial.firstName?.trim() ?? '';
    const lastName = skOfficial.lastName?.trim() ?? '';
    const suffix = skOfficial.suffix?.trim() ?? '';

    return `${firstName} ${lastName}${suffix ? ` ${suffix}` : ''}`.trim();
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Deactivated';
  }

  openAddSkOfficialModal(): void {
    this.showAddModal = true;
    this.addSkOfficialErrorMessage = null;
  }

  closeAddSkOfficialModal(): void {
    if (this.isCreatingSkOfficial) {
      return;
    }

    this.showAddModal = false;
    this.addSkOfficialErrorMessage = null;
  }

  createSkOfficial(payload: CreateSkOfficialPayload): void {
    this.isCreatingSkOfficial = true;
    this.addSkOfficialErrorMessage = null;

    this.skOfficialManagementService.createSkOfficial(payload).subscribe({
      next: (newSkOfficial) => {
        this.skOfficials = [...this.skOfficials, newSkOfficial].sort((left, right) => left.adminId - right.adminId);
        this.showAddModal = false;
        this.addSkOfficialErrorMessage = null;
        this.isCreatingSkOfficial = false;
      },
      error: (error: HttpErrorResponse) => {
        this.addSkOfficialErrorMessage = this.extractCreateSkOfficialErrorMessage(error);
        this.isCreatingSkOfficial = false;
      }
    });
  }

  editSkOfficial(skOfficial: SkOfficialAccount): void {
    this.editingSkOfficial = skOfficial;
    this.showEditModal = true;
    this.editSkOfficialErrorMessage = null;
  }

  closeEditSkOfficialModal(): void {
    if (this.isEditingSkOfficial) {
      return;
    }

    this.showEditModal = false;
    this.editingSkOfficial = null;
    this.editSkOfficialErrorMessage = null;
  }

  updateSkOfficial(payload: UpdateSkOfficialPayload): void {
    if (!this.editingSkOfficial) {
      return;
    }

    this.isEditingSkOfficial = true;
    this.editSkOfficialErrorMessage = null;

    this.skOfficialManagementService.updateSkOfficial(this.editingSkOfficial.adminId, payload).subscribe({
      next: (updatedSkOfficial) => {
        this.skOfficials = this.skOfficials.map((item) =>
          item.adminId === updatedSkOfficial.adminId ? updatedSkOfficial : item
        );
        this.showEditModal = false;
        this.editingSkOfficial = null;
        this.editSkOfficialErrorMessage = null;
        this.isEditingSkOfficial = false;
        this.editSuccessMessage = 'SK Official account has been updated successfully.';
        this.showEditSuccessModal = true;
      },
      error: (error: HttpErrorResponse) => {
        this.editSkOfficialErrorMessage = this.extractUpdateSkOfficialErrorMessage(error);
        this.isEditingSkOfficial = false;
      }
    });
  }

  closeEditSuccessModal(): void {
    this.showEditSuccessModal = false;
    this.editSuccessMessage = '';
  }

  openDeleteSkOfficialModal(skOfficial: SkOfficialAccount): void {
    this.deletingSkOfficial = skOfficial;
    this.showDeleteModal = true;
    this.deleteSkOfficialErrorMessage = null;
  }

  closeDeleteSkOfficialModal(): void {
    if (this.isDeletingSkOfficial) {
      return;
    }

    this.showDeleteModal = false;
    this.deletingSkOfficial = null;
    this.deleteSkOfficialErrorMessage = null;
  }

  confirmDeleteSkOfficial(): void {
    if (!this.deletingSkOfficial) {
      return;
    }

    this.isDeletingSkOfficial = true;
    this.deleteSkOfficialErrorMessage = null;

    const adminId = this.deletingSkOfficial.adminId;
    const officialName = this.getFullName(this.deletingSkOfficial) || 'SK Official';

    this.skOfficialManagementService.deleteSkOfficial(adminId).subscribe({
      next: () => {
        this.skOfficials = this.skOfficials.filter((item) => item.adminId !== adminId);
        this.showDeleteModal = false;
        this.deletingSkOfficial = null;
        this.isDeletingSkOfficial = false;
        this.deleteSuccessMessage = `${officialName} has been deleted successfully.`;
        this.showDeleteSuccessModal = true;
      },
      error: (error: HttpErrorResponse) => {
        this.deleteSkOfficialErrorMessage = this.extractDeleteSkOfficialErrorMessage(error);
        this.isDeletingSkOfficial = false;
      }
    });
  }

  closeDeleteSuccessModal(): void {
    this.showDeleteSuccessModal = false;
    this.deleteSuccessMessage = '';
  }

  private getIsActive(skOfficial: SkOfficialAccount): boolean {
    return Boolean(skOfficial.active ?? skOfficial.isActive ?? true);
  }

  private extractCreateSkOfficialErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error?.error;

    if (typeof responseBody === 'string' && responseBody.trim() !== '') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
      return responseBody.message;
    }

    return 'Unable to create SK Official right now.';
  }

  private extractUpdateSkOfficialErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error?.error;

    if (typeof responseBody === 'string' && responseBody.trim() !== '') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
      return responseBody.message;
    }

    return 'Unable to update SK Official right now.';
  }

  private extractDeleteSkOfficialErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error?.error;

    if (typeof responseBody === 'string' && responseBody.trim() !== '') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
      return responseBody.message;
    }

    return 'Unable to delete SK Official right now.';
  }

  private loadSkOfficials(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.skOfficialManagementService.getSkOfficials().subscribe({
      next: (skOfficials) => {
        this.skOfficials = Array.isArray(skOfficials)
          ? [...skOfficials].sort((left, right) => left.adminId - right.adminId)
          : [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load SK Officials right now.';
        this.isLoading = false;
      }
    });
  }

}

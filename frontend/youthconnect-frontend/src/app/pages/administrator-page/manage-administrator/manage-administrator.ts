import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import {
  AdministratorAccount,
  AdministratorManagementService,
  AdministratorUpdatePayload,
  CreateAdministratorPayload
} from '../../../services/administrator-management.service';
import { AddAdministratorFeature } from '../feature/add-administrator-feature/add-administrator-feature';
import { DeleteAdministratorFeature } from '../feature/delete-administrator-feature/delete-administrator-feature';
import { EditAdministratorFeature } from '../feature/edit-administrator-feature/edit-administrator-feature';

@Component({
  selector: 'app-manage-administrator',
  standalone: true,
  imports: [CommonModule, FormsModule, AddAdministratorFeature, EditAdministratorFeature, DeleteAdministratorFeature],
  templateUrl: './manage-administrator.html',
  styleUrl: './manage-administrator.scss',
})
export class ManageAdministrator implements OnInit {
  private administratorManagementService = inject(AdministratorManagementService);
  administrators: AdministratorAccount[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage: string | null = null;
  private updatingAdministratorIds = new Set<number>();
  showAddModal = false;
  isCreatingAdministrator = false;
  addAdminErrorMessage: string | null = null;
  
  showEditModal = false;
  editingAdministrator: AdministratorAccount | null = null;
  isEditingAdministrator = false;
  editAdminErrorMessage: string | null = null;
  showEditSuccessModal = false;
  editSuccessMessage = '';
  showDeleteModal = false;
  deletingAdministrator: AdministratorAccount | null = null;
  isDeletingAdministrator = false;
  deleteAdminErrorMessage: string | null = null;
  showDeleteSuccessModal = false;
  deleteSuccessMessage = '';

  ngOnInit(): void {
    this.loadAdministrators();
  }

  get filteredAdministrators(): AdministratorAccount[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) {
      return this.administrators;
    }

    return this.administrators.filter((administrator) => {
      const statusText = this.getStatusLabel(administrator.active).toLowerCase();
      return (
        String(administrator.administratorId).includes(normalizedSearchTerm)
        || (administrator.username ?? '').toLowerCase().includes(normalizedSearchTerm)
        || (administrator.email ?? '').toLowerCase().includes(normalizedSearchTerm)
        || statusText.includes(normalizedSearchTerm)
      );
    });
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Deactivated';
  }

  isUpdating(administratorId: number): boolean {
    return this.updatingAdministratorIds.has(administratorId);
  }

  toggleStatus(administrator: AdministratorAccount): void {
    if (this.isUpdating(administrator.administratorId)) {
      return;
    }

    const nextActiveStatus = !administrator.active;
    this.updatingAdministratorIds.add(administrator.administratorId);
    this.errorMessage = null;

    this.administratorManagementService
      .updateAdministratorStatus(administrator.administratorId, nextActiveStatus)
      .subscribe({
        next: (updatedAdministrator) => {
          this.administrators = this.administrators.map((item) =>
            item.administratorId === updatedAdministrator.administratorId ? updatedAdministrator : item
          );
          this.updatingAdministratorIds.delete(administrator.administratorId);
        },
        error: () => {
          this.errorMessage = 'Unable to update administrator status right now.';
          this.updatingAdministratorIds.delete(administrator.administratorId);
        }
      });
  }

  editAdministrator(administrator: AdministratorAccount): void {
    this.editingAdministrator = administrator;
    this.showEditModal = true;
    this.editAdminErrorMessage = null;
  }

  closeEditAdminModal(): void {
    if (this.isEditingAdministrator) {
      return;
    }

    this.showEditModal = false;
    this.editingAdministrator = null;
    this.editAdminErrorMessage = null;
  }

  updateAdministrator(payload: AdministratorUpdatePayload): void {
    if (!this.editingAdministrator) {
      return;
    }

    this.isEditingAdministrator = true;
    this.editAdminErrorMessage = null;

    this.administratorManagementService
      .updateAdministrator(this.editingAdministrator.administratorId, payload)
      .subscribe({
        next: (updatedAdministrator) => {
          this.administrators = this.administrators.map((item) =>
            item.administratorId === updatedAdministrator.administratorId ? updatedAdministrator : item
          );
          this.showEditModal = false;
          this.editingAdministrator = null;
          this.editAdminErrorMessage = null;
          this.isEditingAdministrator = false;
          this.editSuccessMessage = 'Administrator account has been updated successfully.';
          this.showEditSuccessModal = true;
        },
        error: (error: HttpErrorResponse) => {
          this.editAdminErrorMessage = this.extractUpdateAdminErrorMessage(error);
          this.isEditingAdministrator = false;
        }
      });
  }

  closeEditSuccessModal(): void {
    this.showEditSuccessModal = false;
    this.editSuccessMessage = '';
  }

  openDeleteAdminModal(administrator: AdministratorAccount): void {
    this.deletingAdministrator = administrator;
    this.showDeleteModal = true;
    this.deleteAdminErrorMessage = null;
  }

  closeDeleteAdminModal(): void {
    if (this.isDeletingAdministrator) {
      return;
    }

    this.showDeleteModal = false;
    this.deletingAdministrator = null;
    this.deleteAdminErrorMessage = null;
  }

  confirmDeleteAdministrator(): void {
    if (!this.deletingAdministrator) {
      return;
    }

    this.isDeletingAdministrator = true;
    this.deleteAdminErrorMessage = null;

    const administratorId = this.deletingAdministrator.administratorId;
    const administratorName = this.deletingAdministrator.username || 'Administrator';

    this.administratorManagementService.deleteAdministrator(administratorId).subscribe({
      next: () => {
        this.administrators = this.administrators.filter((item) => item.administratorId !== administratorId);
        this.showDeleteModal = false;
        this.deletingAdministrator = null;
        this.isDeletingAdministrator = false;
        this.deleteSuccessMessage = `${administratorName} has been deleted successfully.`;
        this.showDeleteSuccessModal = true;
      },
      error: (error: HttpErrorResponse) => {
        this.deleteAdminErrorMessage = this.extractDeleteAdminErrorMessage(error);
        this.isDeletingAdministrator = false;
      }
    });
  }

  closeDeleteSuccessModal(): void {
    this.showDeleteSuccessModal = false;
    this.deleteSuccessMessage = '';
  }

  // Add Administrator Modal Methods
  openAddAdminModal(): void {
    this.showAddModal = true;
    this.addAdminErrorMessage = null;
  }

  closeAddAdminModal(): void {
    if (this.isCreatingAdministrator) {
      return;
    }

    this.showAddModal = false;
    this.addAdminErrorMessage = null;
  }

  createAdministrator(payload: CreateAdministratorPayload): void {
    this.isCreatingAdministrator = true;
    this.addAdminErrorMessage = null;

    this.administratorManagementService.createAdministrator(payload).subscribe({
      next: (newAdministrator) => {
        this.administrators = [
          ...this.administrators,
          newAdministrator
        ].sort((left, right) => left.administratorId - right.administratorId);
        this.showAddModal = false;
        this.addAdminErrorMessage = null;
        this.isCreatingAdministrator = false;
      },
      error: (error: HttpErrorResponse) => {
        this.addAdminErrorMessage = this.extractCreateAdminErrorMessage(error);
        this.isCreatingAdministrator = false;
      }
    });
  }

  private extractCreateAdminErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error?.error;

    if (typeof responseBody === 'string' && responseBody.trim() !== '') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
      return responseBody.message;
    }

    return 'Unable to create administrator right now.';
  }

  private extractUpdateAdminErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error?.error;

    if (typeof responseBody === 'string' && responseBody.trim() !== '') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
      return responseBody.message;
    }

    return 'Unable to update administrator right now.';
  }

  private extractDeleteAdminErrorMessage(error: HttpErrorResponse): string {
    const responseBody = error?.error;

    if (typeof responseBody === 'string' && responseBody.trim() !== '') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
      return responseBody.message;
    }

    return 'Unable to delete administrator right now.';
  }

  private loadAdministrators(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.administratorManagementService.getAdministrators().subscribe({
      next: (administrators) => {
        this.administrators = Array.isArray(administrators)
          ? [...administrators].sort((left, right) => left.administratorId - right.administratorId)
          : [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load administrators right now.';
        this.isLoading = false;
      }
    });
  }

}

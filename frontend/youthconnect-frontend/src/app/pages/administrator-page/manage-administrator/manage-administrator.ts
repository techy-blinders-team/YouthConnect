import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AdministratorAccount,
  AdministratorManagementService,
  AdministratorUpdatePayload
} from '../../../services/administrator-management.service';

@Component({
  selector: 'app-manage-administrator',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    const nextUsername = window.prompt('Edit username', administrator.username)?.trim();
    if (!nextUsername) {
      return;
    }

    const nextEmail = window.prompt('Edit email', administrator.email)?.trim();
    if (!nextEmail) {
      return;
    }

    const payload: AdministratorUpdatePayload = {
      username: nextUsername,
      email: nextEmail,
      active: administrator.active
    };

    this.errorMessage = null;
    this.updatingAdministratorIds.add(administrator.administratorId);

    this.administratorManagementService.updateAdministrator(administrator.administratorId, payload).subscribe({
      next: (updatedAdministrator) => {
        this.administrators = this.administrators.map((item) =>
          item.administratorId === updatedAdministrator.administratorId ? updatedAdministrator : item
        );
        this.updatingAdministratorIds.delete(administrator.administratorId);
      },
      error: () => {
        this.errorMessage = 'Unable to update administrator right now.';
        this.updatingAdministratorIds.delete(administrator.administratorId);
      }
    });
  }

  deleteAdministrator(administrator: AdministratorAccount): void {
    const confirmed = window.confirm(`Delete administrator "${administrator.username}"?`);
    if (!confirmed) {
      return;
    }

    this.errorMessage = null;
    this.updatingAdministratorIds.add(administrator.administratorId);

    this.administratorManagementService.deleteAdministrator(administrator.administratorId).subscribe({
      next: () => {
        this.administrators = this.administrators.filter(
          (item) => item.administratorId !== administrator.administratorId
        );
        this.updatingAdministratorIds.delete(administrator.administratorId);
      },
      error: () => {
        this.errorMessage = 'Unable to delete administrator right now.';
        this.updatingAdministratorIds.delete(administrator.administratorId);
      }
    });
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

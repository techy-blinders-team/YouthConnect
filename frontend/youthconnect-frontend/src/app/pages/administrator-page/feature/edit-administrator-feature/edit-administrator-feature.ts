import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdministratorAccount, AdministratorUpdatePayload } from '../../../../services/administrator-management.service';

@Component({
  selector: 'app-edit-administrator-feature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-administrator-feature.html',
  styleUrl: './edit-administrator-feature.scss',
})
export class EditAdministratorFeature implements OnChanges {
  private readonly passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,64}$/;

  @Input() isOpen = false;
  @Input() administrator: AdministratorAccount | null = null;
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() closeRequested = new EventEmitter<void>();
  @Output() submitRequested = new EventEmitter<AdministratorUpdatePayload>();

  showConfirmationModal = false;
  editAdminForm = {
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  };
  originalForm = {
    username: '',
    email: ''
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen && !changes['isOpen'].firstChange) {
        this.resetForm();
      }

      if (!this.isOpen) {
        this.showConfirmationModal = false;
      }
    }

    if (changes['administrator'] && this.administrator) {
      this.originalForm = {
        username: this.administrator.username || '',
        email: this.administrator.email || ''
      };
      this.editAdminForm = {
        username: this.administrator.username || '',
        email: this.administrator.email || '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.requestClose();
    }
  }

  requestClose(): void {
    if (this.isSubmitting) {
      return;
    }

    if (this.hasFormChanges()) {
      this.showConfirmationModal = true;
      return;
    }

    this.emitCloseAndReset();
  }

  confirmClose(): void {
    this.emitCloseAndReset();
  }

  cancelClose(): void {
    this.showConfirmationModal = false;
  }

  submit(): void {
    if (!this.isFormValid() || this.isSubmitting) {
      return;
    }

    const payload: AdministratorUpdatePayload = {
      username: this.editAdminForm.username.trim(),
      email: this.editAdminForm.email.trim(),
      active: this.administrator?.active ?? true
    };

    // Only include password if it's provided
    if (this.editAdminForm.newPassword.trim() !== '') {
      payload.password = this.editAdminForm.newPassword.trim();
    }

    this.submitRequested.emit(payload);
  }

  hasFormChanges(): boolean {
    return (
      this.editAdminForm.username.trim() !== this.originalForm.username.trim()
      || this.editAdminForm.email.trim() !== this.originalForm.email.trim()
      || this.editAdminForm.newPassword.trim() !== ''
      || this.editAdminForm.confirmPassword.trim() !== ''
    );
  }

  passwordsMatch(): boolean {
    const newPwd = this.editAdminForm.newPassword.trim();
    const confirmPwd = this.editAdminForm.confirmPassword.trim();

    // If both are empty, it's valid (passwords are optional)
    if (newPwd === '' && confirmPwd === '') {
      return true;
    }

    // If one is empty and the other is not, they don't match
    if ((newPwd === '' && confirmPwd !== '') || (newPwd !== '' && confirmPwd === '')) {
      return false;
    }

    return newPwd === confirmPwd;
  }

  isPasswordPolicyValid(): boolean {
    const newPwd = this.editAdminForm.newPassword.trim();

    if (newPwd === '') {
      return true;
    }

    return this.passwordPolicyRegex.test(newPwd);
  }

  isFormValid(): boolean {
    return (
      this.editAdminForm.username.trim() !== ''
      && this.editAdminForm.email.trim() !== ''
      && this.isPasswordPolicyValid()
      && this.passwordsMatch()
    );
  }

  private emitCloseAndReset(): void {
    this.resetForm();
    this.closeRequested.emit();
  }

  private resetForm(): void {
    if (this.administrator) {
      this.originalForm = {
        username: this.administrator.username || '',
        email: this.administrator.email || ''
      };
      this.editAdminForm = {
        username: this.administrator.username || '',
        email: this.administrator.email || '',
        newPassword: '',
        confirmPassword: ''
      };
    }
    this.showConfirmationModal = false;
  }
}

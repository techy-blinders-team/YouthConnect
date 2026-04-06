import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkOfficialAccount, UpdateSkOfficialPayload } from '../../../../services/sk-official-management.service';

@Component({
  selector: 'app-edit-sk-official-feature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-sk-official-feature.html',
  styleUrl: './edit-sk-official-feature.scss',
})
export class EditSkOfficialFeature implements OnChanges {
  @Input() isOpen = false;
  @Input() skOfficial: SkOfficialAccount | null = null;
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() closeRequested = new EventEmitter<void>();
  @Output() submitRequested = new EventEmitter<UpdateSkOfficialPayload>();

  showConfirmationModal = false;
  editSkOfficialForm = {
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  };
  originalForm = {
    firstName: '',
    lastName: '',
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

    if (changes['skOfficial'] && this.skOfficial) {
      this.originalForm = {
        firstName: this.skOfficial.firstName || '',
        lastName: this.skOfficial.lastName || '',
        email: this.skOfficial.email || ''
      };
      this.editSkOfficialForm = {
        firstName: this.skOfficial.firstName || '',
        lastName: this.skOfficial.lastName || '',
        email: this.skOfficial.email || '',
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

    const payload: UpdateSkOfficialPayload = {
      firstName: this.editSkOfficialForm.firstName.trim(),
      lastName: this.editSkOfficialForm.lastName.trim(),
      email: this.editSkOfficialForm.email.trim(),
      roleId: this.skOfficial?.role?.roleId ?? 2,
      active: this.getIsActive(this.skOfficial)
    };

    if (this.editSkOfficialForm.newPassword.trim() !== '') {
      payload.password = this.editSkOfficialForm.newPassword.trim();
    }

    this.submitRequested.emit(payload);
  }

  hasFormChanges(): boolean {
    return (
      this.editSkOfficialForm.firstName.trim() !== this.originalForm.firstName.trim()
      || this.editSkOfficialForm.lastName.trim() !== this.originalForm.lastName.trim()
      || this.editSkOfficialForm.email.trim() !== this.originalForm.email.trim()
      || this.editSkOfficialForm.newPassword.trim() !== ''
      || this.editSkOfficialForm.confirmPassword.trim() !== ''
    );
  }

  passwordsMatch(): boolean {
    const newPwd = this.editSkOfficialForm.newPassword.trim();
    const confirmPwd = this.editSkOfficialForm.confirmPassword.trim();

    if (newPwd === '' && confirmPwd === '') {
      return true;
    }

    if ((newPwd === '' && confirmPwd !== '') || (newPwd !== '' && confirmPwd === '')) {
      return false;
    }

    return newPwd === confirmPwd;
  }

  isFormValid(): boolean {
    return (
      this.editSkOfficialForm.firstName.trim() !== ''
      && this.editSkOfficialForm.lastName.trim() !== ''
      && this.editSkOfficialForm.email.trim() !== ''
      && this.passwordsMatch()
    );
  }

  private getIsActive(account: SkOfficialAccount | null): boolean {
    return Boolean(account?.active ?? account?.isActive ?? true);
  }

  private emitCloseAndReset(): void {
    this.resetForm();
    this.closeRequested.emit();
  }

  private resetForm(): void {
    if (this.skOfficial) {
      this.originalForm = {
        firstName: this.skOfficial.firstName || '',
        lastName: this.skOfficial.lastName || '',
        email: this.skOfficial.email || ''
      };
      this.editSkOfficialForm = {
        firstName: this.skOfficial.firstName || '',
        lastName: this.skOfficial.lastName || '',
        email: this.skOfficial.email || '',
        newPassword: '',
        confirmPassword: ''
      };
    }

    this.showConfirmationModal = false;
  }
}

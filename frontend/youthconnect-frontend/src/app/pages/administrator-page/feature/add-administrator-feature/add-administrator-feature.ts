import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateAdministratorPayload } from '../../../../services/administrator-management.service';

@Component({
  selector: 'app-add-administrator-feature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-administrator-feature.html',
  styleUrl: './add-administrator-feature.scss',
})
export class AddAdministratorFeature implements OnChanges {
  @Input() isOpen = false;
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() closeRequested = new EventEmitter<void>();
  @Output() submitRequested = new EventEmitter<CreateAdministratorPayload>();

  showConfirmationModal = false;
  newAdminForm = {
    username: '',
    email: '',
    password: ''
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

    if (this.hasFormValues()) {
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

    const payload: CreateAdministratorPayload = {
      username: this.newAdminForm.username.trim(),
      email: this.newAdminForm.email.trim(),
      password: this.newAdminForm.password.trim()
    };

    this.submitRequested.emit(payload);
  }

  hasFormValues(): boolean {
    return (
      this.newAdminForm.username.trim() !== ''
      || this.newAdminForm.email.trim() !== ''
      || this.newAdminForm.password.trim() !== ''
    );
  }

  isFormValid(): boolean {
    return (
      this.newAdminForm.username.trim() !== ''
      && this.newAdminForm.email.trim() !== ''
      && this.newAdminForm.password.trim() !== ''
    );
  }

  private emitCloseAndReset(): void {
    this.resetForm();
    this.closeRequested.emit();
  }

  private resetForm(): void {
    this.newAdminForm = {
      username: '',
      email: '',
      password: ''
    };
    this.showConfirmationModal = false;
  }

}

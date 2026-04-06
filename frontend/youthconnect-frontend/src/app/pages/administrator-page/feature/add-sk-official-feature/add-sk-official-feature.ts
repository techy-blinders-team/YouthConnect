import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CreateSkOfficialPayload } from '../../../../services/sk-official-management.service';

@Component({
  selector: 'app-add-sk-official-feature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-sk-official-feature.html',
  styleUrl: './add-sk-official-feature.scss',
})
export class AddSkOfficialFeature implements OnChanges {
  @Input() isOpen = false;
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() closeRequested = new EventEmitter<void>();
  @Output() submitRequested = new EventEmitter<CreateSkOfficialPayload>();

  showConfirmationModal = false;
  newSkOfficialForm = {
    firstName: '',
    lastName: '',
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

    const payload: CreateSkOfficialPayload = {
      firstName: this.newSkOfficialForm.firstName.trim(),
      lastName: this.newSkOfficialForm.lastName.trim(),
      email: this.newSkOfficialForm.email.trim(),
      password: this.newSkOfficialForm.password.trim(),
      roleId: 2,
      active: true
    };

    this.submitRequested.emit(payload);
  }

  hasFormValues(): boolean {
    return (
      this.newSkOfficialForm.firstName.trim() !== ''
      || this.newSkOfficialForm.lastName.trim() !== ''
      || this.newSkOfficialForm.email.trim() !== ''
      || this.newSkOfficialForm.password.trim() !== ''
    );
  }

  isFormValid(): boolean {
    return (
      this.newSkOfficialForm.firstName.trim() !== ''
      && this.newSkOfficialForm.lastName.trim() !== ''
      && this.newSkOfficialForm.email.trim() !== ''
      && this.newSkOfficialForm.password.trim() !== ''
    );
  }

  private emitCloseAndReset(): void {
    this.resetForm();
    this.closeRequested.emit();
  }

  private resetForm(): void {
    this.newSkOfficialForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
    this.showConfirmationModal = false;
  }
}

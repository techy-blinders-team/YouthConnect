import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AdministratorAccount } from '../../../../services/administrator-management.service';

@Component({
  selector: 'app-delete-administrator-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-administrator-feature.html',
  styleUrl: './delete-administrator-feature.scss',
})
export class DeleteAdministratorFeature {
  @Input() isOpen = false;
  @Input() administrator: AdministratorAccount | null = null;
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() closeRequested = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.requestClose();
    }
  }

  requestClose(): void {
    if (this.isSubmitting) {
      return;
    }

    this.closeRequested.emit();
  }

  confirmDelete(): void {
    if (this.isSubmitting) {
      return;
    }

    this.deleteRequested.emit();
  }
}

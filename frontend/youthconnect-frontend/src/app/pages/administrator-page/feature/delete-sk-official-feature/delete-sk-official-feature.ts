import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SkOfficialAccount } from '../../../../services/sk-official-management.service';

@Component({
  selector: 'app-delete-sk-official-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-sk-official-feature.html',
  styleUrl: './delete-sk-official-feature.scss',
})
export class DeleteSkOfficialFeature {
  @Input() isOpen = false;
  @Input() skOfficial: SkOfficialAccount | null = null;
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

  getDisplayName(): string {
    const firstName = this.skOfficial?.firstName?.trim() ?? '';
    const lastName = this.skOfficial?.lastName?.trim() ?? '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || 'this SK official';
  }
}

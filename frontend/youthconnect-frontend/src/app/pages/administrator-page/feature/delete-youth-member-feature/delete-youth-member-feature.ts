import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { YouthMemberListItem } from '../../../../services/youth-member-management.service';

@Component({
  selector: 'app-delete-youth-member-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-youth-member-feature.html',
  styleUrl: './delete-youth-member-feature.scss',
})
export class DeleteYouthMemberFeature {
  @Input() isOpen = false;
  @Input() youthMember: YouthMemberListItem | null = null;
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
    const firstName = this.youthMember?.firstName?.trim() ?? '';
    const lastName = this.youthMember?.lastName?.trim() ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'this youth member';
  }
}

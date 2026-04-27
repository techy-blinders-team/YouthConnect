import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CivilStatus, Gender } from '../../../../models/enums';
import { UpdateYouthProfilePayload, UpdateYouthUserPayload, YouthMemberListItem } from '../../../../services/youth-member-management.service';

export interface UpdateYouthMemberPayload {
  user: UpdateYouthUserPayload;
  profile: UpdateYouthProfilePayload;
}

@Component({
  selector: 'app-edit-youth-member-feature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-youth-member-feature.html',
  styleUrl: './edit-youth-member-feature.scss',
})
export class EditYouthMemberFeature implements OnChanges {
  @Input() isOpen = false;
  @Input() youthMember: YouthMemberListItem | null = null;
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;

  @Output() closeRequested = new EventEmitter<void>();
  @Output() submitRequested = new EventEmitter<UpdateYouthMemberPayload>();

  readonly genders = [Gender.MALE, Gender.FEMALE];
  readonly civilStatuses = [
    CivilStatus.SINGLE,
    CivilStatus.MARRIED,
    CivilStatus.WIDOWED,
    CivilStatus.ANNULLED
  ];

  showConfirmationModal = false;
  editYouthMemberForm = {
    firstName: '',
    lastName: '',
    email: '',
    gender: Gender.MALE,
    birthday: '',
    contactNumber: '',
    civilStatus: CivilStatus.SINGLE
  };

  originalForm = {
    firstName: '',
    lastName: '',
    email: '',
    gender: Gender.MALE,
    birthday: '',
    contactNumber: '',
    civilStatus: CivilStatus.SINGLE
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

    if (changes['youthMember'] && this.youthMember) {
      this.originalForm = this.toFormState(this.youthMember);
      this.editYouthMemberForm = { ...this.originalForm };
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
    if (!this.isFormValid() || this.isSubmitting || !this.youthMember) {
      return;
    }

    const payload: UpdateYouthMemberPayload = {
      user: {
        email: this.editYouthMemberForm.email.trim(),
        roleId: 1,
        active: this.youthMember.isActive,
        status: this.youthMember.status
      },
      profile: {
        firstName: this.editYouthMemberForm.firstName.trim(),
        middleName: this.youthMember.middleName ?? '',
        lastName: this.editYouthMemberForm.lastName.trim(),
        suffix: this.youthMember.suffix ?? null,
        gender: this.editYouthMemberForm.gender,
        birthday: this.editYouthMemberForm.birthday,
        contactNumber: this.editYouthMemberForm.contactNumber.trim(),
        completeAddress: this.youthMember.completeAddress ?? '',
        civilStatus: this.editYouthMemberForm.civilStatus
      }
    };

    this.submitRequested.emit(payload);
  }

  hasFormChanges(): boolean {
    return (
      this.editYouthMemberForm.firstName.trim() !== this.originalForm.firstName.trim()
      || this.editYouthMemberForm.lastName.trim() !== this.originalForm.lastName.trim()
      || this.editYouthMemberForm.email.trim() !== this.originalForm.email.trim()
      || this.editYouthMemberForm.gender !== this.originalForm.gender
      || this.editYouthMemberForm.birthday !== this.originalForm.birthday
      || this.editYouthMemberForm.contactNumber.trim() !== this.originalForm.contactNumber.trim()
      || this.editYouthMemberForm.civilStatus !== this.originalForm.civilStatus
    );
  }

  isFormValid(): boolean {
    return (
      this.editYouthMemberForm.firstName.trim() !== ''
      && this.editYouthMemberForm.lastName.trim() !== ''
      && this.editYouthMemberForm.email.trim() !== ''
      && this.editYouthMemberForm.gender !== null
      && this.editYouthMemberForm.birthday.trim() !== ''
      && this.editYouthMemberForm.contactNumber.trim() !== ''
      && this.editYouthMemberForm.civilStatus !== null
    );
  }

  getGenderLabel(gender: Gender): string {
    return gender === Gender.MALE ? 'Male' : 'Female';
  }

  getCivilStatusLabel(status: CivilStatus): string {
    return status
      .toLowerCase()
      .replace('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private emitCloseAndReset(): void {
    this.resetForm();
    this.closeRequested.emit();
  }

  private resetForm(): void {
    if (this.youthMember) {
      this.originalForm = this.toFormState(this.youthMember);
      this.editYouthMemberForm = { ...this.originalForm };
    }
    this.showConfirmationModal = false;
  }

  private toFormState(member: YouthMemberListItem): typeof this.editYouthMemberForm {
    return {
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      gender: member.gender ?? Gender.MALE,
      birthday: this.toInputDate(member.birthday),
      contactNumber: member.contactNumber || '',
      civilStatus: member.civilStatus ?? CivilStatus.SINGLE
    };
  }

  private toInputDate(rawValue: string): string {
    if (!rawValue) {
      return '';
    }

    const match = rawValue.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) {
      return match[0];
    }

    const parsed = new Date(rawValue);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

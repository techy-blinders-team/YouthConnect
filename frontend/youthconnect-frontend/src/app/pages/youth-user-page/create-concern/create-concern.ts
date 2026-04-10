import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-concern',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-concern.html',
  styleUrl: './create-concern.scss',
})
export class CreateConcern {
  showModal = false;
  showDeleteModal = false;
  concernForm: FormGroup;
  editingConcernId: number | null = null;
  concernToDelete: any = null;

  concerns = [
    { id: 1, title: 'Sample Concerns', type: 'PROJECT_CONCERN', status: 'OPEN' },
    { id: 2, title: 'Sample Concerns', type: 'COMMUNITY_CONCERN', status: 'OPEN' },
    { id: 3, title: 'Sample Concerns', type: 'SYSTEM_CONCERN', status: 'OPEN' },
    { id: 4, title: 'Sample Concerns', type: 'PROJECT_CONCERN', status: 'OPEN' }
  ];

  concernTypes = [
    { value: 'PROJECT_CONCERN', label: 'Project Concern' },
    { value: 'COMMUNITY_CONCERN', label: 'Community Concern' },
    { value: 'SYSTEM_CONCERN', label: 'System Concern' }
  ];

  constructor(private fb: FormBuilder) {
    this.concernForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      typeOfConcern: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  openModal() {
    this.showModal = true;
    this.editingConcernId = null;
    this.concernForm.reset();
  }

  closeModal() {
    this.showModal = false;
    this.editingConcernId = null;
    this.concernForm.reset();
  }

  submitConcern() {
    if (this.concernForm.valid) {
      const formValue = this.concernForm.value;

      if (this.editingConcernId) {
        // Update existing concern
        const index = this.concerns.findIndex(c => c.id === this.editingConcernId);
        if (index !== -1) {
          this.concerns[index] = {
            ...this.concerns[index],
            title: formValue.title,
            type: formValue.typeOfConcern
          };
          console.log('Concern updated:', this.concerns[index]);
        }
      } else {
        // Add new concern
        const newConcern = {
          id: Math.max(...this.concerns.map(c => c.id), 0) + 1,
          title: formValue.title,
          type: formValue.typeOfConcern,
          status: 'OPEN' as const
        };
        this.concerns.unshift(newConcern);
        console.log('New concern created:', newConcern);
      }

      // TODO: Call API to submit/update concern
      this.closeModal();
    } else {
      this.concernForm.markAllAsTouched();
    }
  }

  editConcern(concern: any) {
    this.editingConcernId = concern.id;
    this.concernForm.patchValue({
      title: concern.title,
      typeOfConcern: concern.type,
      description: '' // Description not stored in sample data
    });
    this.showModal = true;
    console.log('Editing concern:', concern);
  }

  deleteConcern(concern: any) {
    this.concernToDelete = concern;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.concernToDelete) {
      const index = this.concerns.findIndex(c => c.id === this.concernToDelete.id);
      if (index !== -1) {
        this.concerns.splice(index, 1);
        console.log('Concern deleted:', this.concernToDelete);
        // TODO: Call API to delete concern
      }
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.concernToDelete = null;
  }
}

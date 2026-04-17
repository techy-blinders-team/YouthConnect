import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegistrationRequest } from '../../models/auth.model';

const STEP_FIELDS: Record<number, string[]> = {
  1: ['firstName', 'middleName', 'lastName', 'suffix', 'gender', 'birthday', 'contactNumber', 'completeAddress', 'civilStatus'],
  2: ['youthClassification', 'educationBackground', 'workStatus', 'votingStatus', 'numberOfAttendedAssemblies', 'reason'],
  3: ['email', 'password', 'confirmPassword'],
};

type PasswordCriterion = {
  label: string;
  met: boolean;
};

function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '') as string;

  if (!value) {
    return null;
  }

  const hasLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

  return hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
    ? null
    : { weakPassword: true };
}

@Component({
  selector: 'app-sign-up-page',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.scss',
})
export class SignUpPage {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  registrationForm: FormGroup;
  currentStep = 1;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.registrationForm = this.formBuilder.group(
      {
        // Step 1 — Youth Profile
        firstName: ['', {
          validators: [Validators.required, Validators.maxLength(50)],
          updateOn: 'change'
        }],
        middleName: ['', {
          validators: [Validators.required, Validators.maxLength(50)],
          updateOn: 'change'
        }],
        lastName: ['', {
          validators: [Validators.required, Validators.maxLength(50)],
          updateOn: 'change'
        }],
        suffix: ['', {
          validators: [Validators.maxLength(50)],
          updateOn: 'change'
        }],
        gender: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],
        birthday: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],
        contactNumber: ['', {
          validators: [Validators.required, Validators.pattern(/^9\d{9}$/)],
          updateOn: 'change'
        }],
        completeAddress: ['', {
          validators: [Validators.required, Validators.maxLength(200)],
          updateOn: 'change'
        }],
        civilStatus: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],

        // Step 2 — Youth Classification
        youthClassification: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],
        educationBackground: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],
        workStatus: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],
        votingStatus: [[], {
          validators: [Validators.required],
          updateOn: 'change'
        }],
        numberOfAttendedAssemblies: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],
        reason: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],

        // Step 3 — Account Creation
        email: ['', {
          validators: [Validators.required, Validators.email],
          updateOn: 'change'
        }],
        password: ['', {
          validators: [Validators.required, Validators.minLength(8), strongPasswordValidator],
          updateOn: 'change'
        }],
        confirmPassword: ['', {
          validators: [Validators.required],
          updateOn: 'change'
        }],
      },
      {
        validators: [passwordMatchValidator]
      }
    );
  }

nextStep(): void {
  const fields = STEP_FIELDS[this.currentStep];
  const hasInvalidField = fields.some(field => {
    const control = this.registrationForm.get(field);
    control?.markAsTouched();
    control?.updateValueAndValidity(); 
    return control?.invalid;
  });

  if (hasInvalidField) {
    console.log('Step', this.currentStep, 'has invalid fields');
    fields.forEach(field => {
      const control = this.registrationForm.get(field);
      if (control?.invalid) {
        console.log(`  - ${field} is invalid:`, control.errors);
      }
    });
    return;
  }

  if (this.currentStep < 3) {
    this.currentStep++;
    this.errorMessage = '';
    this.successMessage = '';
  }
}

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isVotingStatusSelected(status: string): boolean {
    const selectedStatuses = this.votingStatusControl?.value as string[] | null;
    return Array.isArray(selectedStatuses) && selectedStatuses.includes(status);
  }

  onVotingStatusChange(event: Event, status: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const selectedStatuses = [...((this.votingStatusControl?.value as string[] | null) ?? [])];

    if (isChecked && !selectedStatuses.includes(status)) {
      selectedStatuses.push(status);
    }

    if (!isChecked) {
      const updatedStatuses = selectedStatuses.filter((selectedStatus) => selectedStatus !== status);
      this.votingStatusControl?.setValue(updatedStatuses);
      this.votingStatusControl?.markAsTouched();
      this.votingStatusControl?.updateValueAndValidity();
      return;
    }

    this.votingStatusControl?.setValue(selectedStatuses);
    this.votingStatusControl?.markAsTouched();
    this.votingStatusControl?.updateValueAndValidity();
  }

  cancel(): void {
    this.registrationForm.reset();
    this.currentStep = 1;
    this.errorMessage = '';
    this.successMessage = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.router.navigate(['/login']);
  }

  register(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.registrationForm.value;
    const votingStatus = Array.isArray(formValue.votingStatus) ? formValue.votingStatus : [];

    const registrationData: RegistrationRequest = {
      firstName: formValue.firstName,
      middleName: formValue.middleName,
      lastName: formValue.lastName,
      suffix: formValue.suffix || undefined,
      gender: formValue.gender,
      birthday: formValue.birthday,
      contactNumber: formValue.contactNumber,
      completeAddress: formValue.completeAddress,
      civilStatus: formValue.civilStatus,
      email: formValue.email,
      password: formValue.password,
      youthClassification: formValue.youthClassification,
      educationBackground: formValue.educationBackground,
      workStatus: formValue.workStatus,
      skVoter: votingStatus.includes('skVoter'),
      nationalVoter: votingStatus.includes('nationalVoter'),
      pastVoter: votingStatus.includes('pastVoter'),
      numAttended: Number(formValue.numberOfAttendedAssemblies ?? 0),
      nonAttendedReason: formValue.reason || undefined,
    };

    this.authService.register(registrationData).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          console.log('Registration successful:', res);
          this.registrationForm.reset();
          this.showPassword = false;
          this.showConfirmPassword = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.errorMessage = res.message ?? 'Registration failed. Please try again.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        switch (err.status) {
          case 400:
            this.errorMessage = err.error?.message || 'Invalid registration data. Please check your inputs.';
            break;
          case 409:
            this.errorMessage = 'Email already exists. Please use a different email.';
            break;
          case 422:
            this.errorMessage = 'Validation error. Please check your form data.';
            break;
          case 500:
            this.errorMessage = 'Server error. Please try again later.';
            break;
          default:
            this.errorMessage = err.error?.message || 'Registration failed. Please check your connection.';
        }

        console.error('Registration error:', err);
      }
    });
  }

  // Step 1 — Youth Profile Getters
  get firstNameControl() {
    return this.registrationForm.get('firstName');
  }

  get middleNameControl() {
    return this.registrationForm.get('middleName');
  }

  get lastNameControl() {
    return this.registrationForm.get('lastName');
  }

  get suffixControl() {
    return this.registrationForm.get('suffix');
  }

  get genderControl() {
    return this.registrationForm.get('gender');
  }

  get birthdayControl() {
    return this.registrationForm.get('birthday');
  }

  get contactNumberControl() {
    return this.registrationForm.get('contactNumber');
  }

  get completeAddressControl() {
    return this.registrationForm.get('completeAddress');
  }

  get civilStatusControl() {
    return this.registrationForm.get('civilStatus');
  }

  // Step 2 — Youth Classification Getters
  get youthClassificationControl() {
    return this.registrationForm.get('youthClassification');
  }

  get educationBackgroundControl() {
    return this.registrationForm.get('educationBackground');
  }

  get workStatusControl() {
    return this.registrationForm.get('workStatus');
  }

  get votingStatusControl() {
    return this.registrationForm.get('votingStatus');
  }

  get numberOfAttendedAssembliesControl() {
    return this.registrationForm.get('numberOfAttendedAssemblies');
  }

  get reasonControl() {
    return this.registrationForm.get('reason');
  }

  // Step 3 — Account Creation Getters
  get emailControl() {
    return this.registrationForm.get('email');
  }

  get passwordControl() {
    return this.registrationForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registrationForm.get('confirmPassword');
  }

  get passwordCriteria(): PasswordCriterion[] {
    const passwordValue = (this.passwordControl?.value ?? '') as string;

    return [
      { label: 'At least 8 characters', met: passwordValue.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(passwordValue) },
      { label: 'One lowercase letter', met: /[a-z]/.test(passwordValue) },
      { label: 'One number', met: /\d/.test(passwordValue) },
      { label: 'One special character', met: /[^A-Za-z0-9]/.test(passwordValue) },
    ];
  }

  get passwordStrengthScore(): number {
    return this.passwordCriteria.filter((criterion) => criterion.met).length;
  }

  get passwordStrengthPercent(): number {
    return (this.passwordStrengthScore / this.passwordCriteria.length) * 100;
  }

  get passwordStrengthLabel(): string {
    if (this.passwordStrengthScore <= 1) {
      return 'Weak';
    }

    if (this.passwordStrengthScore <= 3) {
      return 'Fair';
    }

    if (this.passwordStrengthScore === 4) {
      return 'Good';
    }

    return 'Strong';
  }

  get passwordStrengthClass(): string {
    if (this.passwordStrengthScore <= 1) {
      return 'weak';
    }

    if (this.passwordStrengthScore <= 3) {
      return 'fair';
    }

    if (this.passwordStrengthScore === 4) {
      return 'good';
    }

    return 'strong';
  }
}
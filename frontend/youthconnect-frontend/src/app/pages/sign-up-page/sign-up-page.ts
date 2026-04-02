import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';

const STEP_FIELDS: Record<number, string[]> = {
  1: ['firstName', 'middleName', 'lastName', 'gender', 'birthday', 'contactNumber', 'completeAddress', 'civilStatus'],
  2: ['youthClassification', 'workStatus', 'votingStatus', 'numberOfAttendedAssemblies', 'reason'],
  3: ['email', 'password', 'confirmPassword'],
};

function passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-sign-up-page',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.scss',
})
export class SignUpPage {
  formBuilder = inject(FormBuilder);
  registrationForm: FormGroup;
  currentStep = 1;

  constructor() {
    this.registrationForm = this.formBuilder.group({
      // Step 1 — Youth Profile
      firstName:       ['', [Validators.required, Validators.maxLength(50)]],
      middleName:      ['', [Validators.required, Validators.maxLength(50)]],
      lastName:        ['', [Validators.required, Validators.maxLength(50)]],
      suffix:          ['', [Validators.maxLength(50)]],
      gender:          ['', [Validators.required]],
      birthday:        ['', [Validators.required]],
      contactNumber:   ['', [Validators.required, Validators.maxLength(15)]],
      completeAddress: ['', [Validators.required, Validators.maxLength(200)]],
      civilStatus:     ['', [Validators.required]],

      // Step 2 — Youth Classification
      youthClassification: ['', [Validators.required]],
      educationBackground: ['', [Validators.required]],
      workStatus: ['', [Validators.required]],
      votingStatus: ['', [Validators.required]],
      numberOfAttendedAssemblies:['', [Validators.required]],
      reason:['', [Validators.required]],

      // Step 3 — Account Creation
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
    { validators: passwordMatchValidator }
  }

  /** Validate only the fields for the current step before advancing */
  nextStep(): void {
    const fields = STEP_FIELDS[this.currentStep];
    const hasInvalidField = fields.some(field => {
      const control = this.registrationForm.get(field);
      control?.markAsTouched();
      return control?.invalid;
    });

    if (hasInvalidField) return; 

    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  cancel(): void {
    this.registrationForm.reset();
    this.currentStep = 1;
  }

  registrationValidationForm(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    console.log(this.registrationForm.value);
    this.registrationForm.reset();
    this.currentStep = 1;
  }

// Step 1 — Youth Profile
get firstNameControl() { 
  return this.registrationForm.get('firstName'); 
}
get middleNameControl(){ 
  return this.registrationForm.get('middleName'); 
}
get lastNameControl(){ 
  return this.registrationForm.get('lastName'); 
}
get genderControl(){ 
  return this.registrationForm.get('gender'); 
}
get birthdayControl(){ 
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

// Step 2 — Youth Classification
get youthClassificationControl(){ 
  return this.registrationForm.get('youthClassification'); 
}
get workStatusControl() { 
  return this.registrationForm.get('workStatus'); 
}
get votingStatusControl(){ 
  return this.registrationForm.get('votingStatus'); 
}
get numberOfAttendedAssembliesControl() {
  return this.registrationForm.get('numberOfAttendedAssemblies'); 
}
get reasonControl() {
  return this.registrationForm.get('reason'); 
}

// Step 3 — Account Creation
get emailControl(){ 
  return this.registrationForm.get('email'); 
}
get passwordControl(){ 
  return this.registrationForm.get('password'); 
}
get confirmPasswordControl() { 
  return this.registrationForm.get('confirmPassword'); 
}
}
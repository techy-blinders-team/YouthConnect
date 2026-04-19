import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  loginForm: FormGroup;
  showPassword = false;

  // Signal-based state management
  successModalOpen = signal(false);
  errorModalOpen = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', {
        validators: [Validators.required, Validators.email, Validators.maxLength(50)],
        updateOn: 'change'
      }],
      password: ['', {
        validators: [Validators.required],
        updateOn: 'change'
      }],
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['expired']) {
        this.errorMessage.set('Your session has expired. Please login again.');
        this.errorModalOpen.set(true);
      }
    });
  }

  /**
   * Handle login form submission
   */
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successModalOpen.set(true);

    const userData: LoginRequest = {
      email: this.emailControl?.value,
      password: this.passwordControl?.value
    };

    this.authService.login(userData).subscribe({
      next: (res) => {
        this.isLoading.set(false);

        if (res.success) {
          console.log('Login successful');
          this.successModalOpen.set(true);
          this.loginForm.reset();

          setTimeout(() => {
            const role = this.authService.getUserRole();
            if (role) {
              this.authService.redirectByRole(role);
            }
            this.successModalOpen.set(false);
          }, 1500);
        } else {
          this.successModalOpen.set(false);
          this.errorMessage.set(res.message ?? 'Login failed. Please try again.');
          this.errorModalOpen.set(true);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.successModalOpen.set(false);

        const errorMsg = this.getErrorMessage(err);
        this.errorMessage.set(errorMsg);
        this.errorModalOpen.set(true);
      }
    });
  }

  private getErrorMessage(err: HttpErrorResponse): string {
    if (err.error && err.error.message) {
      return err.error.message;
    }

    switch (err.status) {
      case 400:
        return 'Invalid email or password format.';
      case 401:
        return 'Invalid email or password.';
      case 403:
        return "You don't have permission to access this.";
      case 404:
        return 'Account not found.';
      case 429:
        return 'Too many login attempts. Please try again later.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      case 0:
        return 'Network error. Please check your internet connection.';
      default:
        return 'Login failed. Please check your credentials and try again.';
    }
  }


  closeErrorModal() {
    this.errorModalOpen.set(false);
    this.errorMessage.set('');
  }


  closeSuccessModal() {
    this.successModalOpen.set(false);
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Get email form control
   */
  get emailControl() {
    return this.loginForm.get('email');
  }

  /**
   * Get password form control
   */
  get passwordControl() {
    return this.loginForm.get('password');
  }

  /**
   * Check if field is invalid and touched/dirty
   */
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
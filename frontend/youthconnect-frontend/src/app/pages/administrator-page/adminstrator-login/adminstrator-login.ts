import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAuthService } from '../services/admin-auth.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-adminstrator-login',
  imports: [ReactiveFormsModule],
  templateUrl: './adminstrator-login.html',
  styleUrl: './adminstrator-login.scss',
})
export class AdminstratorLogin {
  formBuilder = inject(FormBuilder);
  adminAuthService = inject(AdminAuthService);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change'
      }],
      password: ['', {
        validators: [Validators.required],
        updateOn: 'change'
      }],
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  isFormValid(): boolean {
    return this.loginForm.valid && this.emailControl?.value && this.passwordControl?.value;
  }

  login(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const email = this.emailControl?.value;
    const password = this.passwordControl?.value;

    this.adminAuthService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success && response.token) {
          // Store admin info in localStorage
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_role', 'admin');
          localStorage.setItem('auth_name', response.username || '');
          localStorage.setItem('admin_id', response.administratorId?.toString() || '');
          
          // Redirect to admin dashboard
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred during login';
        console.error('Login error:', error);
      }
    });
  }
}

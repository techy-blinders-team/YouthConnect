import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkOfficialAuthService } from '../../../services/sk-official-auth.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sk-official-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './sk-official-login.html',
  styleUrl: './sk-official-login.scss',
})
export class SkOfficialLogin {
  private formBuilder = inject(FormBuilder);
  private skOfficialAuthService = inject(SkOfficialAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const email = this.emailControl?.value;
    const password = this.passwordControl?.value;

    const skOfficialData = {
      email: email,
      password: password
    };

    this.skOfficialAuthService.login(skOfficialData).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (response.success) {
          console.log('SK Official login successful');
          this.loginForm.reset();

          // Store token and role for SK Official
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          localStorage.setItem('auth_role', 'sk-official');
          if (response.skOfficialId) {
            localStorage.setItem('sk_official_id', response.skOfficialId.toString());
          }

          // Redirect to SK Official dashboard
          this.router.navigate(['/sk-official/dashboard']);
        } else {
          this.errorMessage = response.message ?? 'Login failed. Please try again.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        // Try to get the message from the backend response
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          // Fallback to generic messages based on status code
          switch (err.status) {
            case 401:
              this.errorMessage = 'Invalid email or password.';
              break;
            case 403:
              this.errorMessage = "You don't have permission to access this.";
              break;
            case 404:
              this.errorMessage = 'Account not found.';
              break;
            case 500:
              this.errorMessage = 'Server error. Please try again later.';
              break;
            default:
              this.errorMessage = 'Login failed. Please check your connection.';
          }
        }
      }
    });
  }
}

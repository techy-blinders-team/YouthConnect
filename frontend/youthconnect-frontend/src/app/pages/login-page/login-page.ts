import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SkOfficialAuthService } from '../../services/sk-official-auth.service';
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
  private skOfficialAuthService = inject(SkOfficialAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  loginForm: FormGroup;
  skOfficialLoginForm: FormGroup;
  activeTab: 'youth' | 'sk' = 'youth';
  isLoading = false;
  isSkOfficialLoading = false;
  errorMessage = '';
  skOfficialErrorMessage = '';
  showPassword = false;
  showSkOfficialPassword = false;

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

    this.skOfficialLoginForm = this.formBuilder.group({
      skEmail: ['', {
        validators: [Validators.required, Validators.email, Validators.maxLength(50)],
        updateOn: 'change'
      }],
      skPassword: ['', {
        validators: [Validators.required],
        updateOn: 'change'
      }],
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['expired']) {
        this.errorMessage = 'Your session has expired. Please login again.';
      }
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData: LoginRequest = {
      email: this.emailControl?.value,
      password: this.passwordControl?.value
    };

    this.authService.login(userData).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.success) {
          console.log('Login successful');
          this.loginForm.reset();

          const role = this.authService.getUserRole();
          if (role) {
            this.authService.redirectByRole(role);
          }
        } else {
          this.errorMessage = res.message ?? 'Login failed. Please try again.';
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

  loginSkOfficial() {
    if (this.skOfficialLoginForm.invalid) {
      this.skOfficialLoginForm.markAllAsTouched();
      return;
    }

    this.isSkOfficialLoading = true;
    this.skOfficialErrorMessage = '';

    const skOfficialData = {
      email: this.skEmailControl?.value,
      password: this.skPasswordControl?.value
    };

    this.skOfficialAuthService.login(skOfficialData).subscribe({
      next: (res) => {
        this.isSkOfficialLoading = false;

        if (res.success && res.token) {
          console.log('SK Official login successful');
          
          // Store token and role for SK Official
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('auth_role', 'sk-official');
          localStorage.setItem('auth_user', JSON.stringify(res));
          
          this.skOfficialLoginForm.reset();
          
          // Redirect to SK Official dashboard
          this.router.navigate(['/sk-official/dashboard']);
        } else {
          this.skOfficialErrorMessage = res.message ?? 'Login failed. Please try again.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isSkOfficialLoading = false;

        // Try to get the message from the backend response
        if (err.error && err.error.message) {
          this.skOfficialErrorMessage = err.error.message;
        } else {
          // Fallback to generic messages based on status code
          switch (err.status) {
            case 401:
              this.skOfficialErrorMessage = 'Invalid email or password.';
              break;
            case 403:
              this.skOfficialErrorMessage = "You don't have permission to access this.";
              break;
            case 404:
              this.skOfficialErrorMessage = 'Account not found.';
              break;
            case 500:
              this.skOfficialErrorMessage = 'Server error. Please try again later.';
              break;
            default:
              this.skOfficialErrorMessage = 'Login failed. Please check your connection.';
          }
        }
      }
    });
  }

  switchTab(tab: 'youth' | 'sk') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.skOfficialErrorMessage = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleSkOfficialPasswordVisibility() {
    this.showSkOfficialPassword = !this.showSkOfficialPassword;
  }

  get emailControl() {
    return this.loginForm.get('email');
  }
  
  get passwordControl() {
    return this.loginForm.get('password');
  }

  get skEmailControl() {
    return this.skOfficialLoginForm.get('skEmail');
  }
  
  get skPasswordControl() {
    return this.skOfficialLoginForm.get('skPassword');
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isSkOfficialFieldInvalid(field: string): boolean {
    const control = this.skOfficialLoginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
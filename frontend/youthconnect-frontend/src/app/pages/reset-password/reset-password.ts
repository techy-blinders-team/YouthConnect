import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.scss'
})
export class ResetPasswordPage implements OnInit {
    token: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    isLoading: boolean = false;
    isValidatingToken: boolean = true;
    isTokenValid: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    constructor(
        private passwordResetService: PasswordResetService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Get token from URL query params
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || '';
            if (this.token) {
                this.validateToken();
            } else {
                this.isValidatingToken = false;
                this.errorMessage = 'Invalid reset link. Please request a new password reset.';
            }
        });
    }

    validateToken() {
        this.isValidatingToken = true;
        this.passwordResetService.validateToken(this.token).subscribe({
            next: (response) => {
                this.isValidatingToken = false;
                this.isTokenValid = response.valid;
                if (!response.valid) {
                    this.errorMessage = response.message || 'Invalid or expired reset token';
                }
            },
            error: (error) => {
                this.isValidatingToken = false;
                this.isTokenValid = false;
                this.errorMessage = 'Failed to validate reset token. Please try again.';
                console.error('Token validation error:', error);
            }
        });
    }

    onSubmit() {
        // Validation
        if (!this.newPassword || !this.confirmPassword) {
            this.errorMessage = 'Please fill in all fields';
            return;
        }

        if (this.newPassword.length < 8) {
            this.errorMessage = 'Password must be at least 8 characters long';
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match';
            return;
        }

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.passwordResetService.resetPassword(this.token, this.newPassword).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.successMessage = response.message;
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 3000);
                } else {
                    this.errorMessage = response.message || 'Failed to reset password';
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
                console.error('Reset password error:', error);
            }
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    getPasswordStrength(): string {
        if (!this.newPassword) return '';
        if (this.newPassword.length < 8) return 'weak';
        if (this.newPassword.length < 12) return 'medium';
        return 'strong';
    }

    hasUppercase(password: string): boolean {
        return /[A-Z]/.test(password);
    }

    hasLowercase(password: string): boolean {
        return /[a-z]/.test(password);
    }

    hasNumber(password: string): boolean {
        return /[0-9]/.test(password);
    }

    hasSpecialChar(password: string): boolean {
        return /[!@#$%^&*(),.?":{}|<>]/.test(password);
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}

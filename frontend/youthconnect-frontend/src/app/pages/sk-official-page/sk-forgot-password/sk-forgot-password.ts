import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PasswordResetService } from '../../../services/password-reset.service';

@Component({
    selector: 'app-sk-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './sk-forgot-password.html',
    styleUrl: './sk-forgot-password.scss'
})
export class SkForgotPasswordPage {
    email: string = '';
    isLoading: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private passwordResetService: PasswordResetService,
        private router: Router
    ) { }

    onSubmit() {
        if (!this.email || !this.isValidEmail(this.email)) {
            this.errorMessage = 'Please enter a valid email address';
            return;
        }

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.passwordResetService.skOfficialForgotPassword(this.email).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.successMessage = response.message;
                    this.email = '';
                } else {
                    this.errorMessage = response.message || 'An error occurred. Please try again.';
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'An error occurred. Please try again later.';
                console.error('Forgot password error:', error);
            }
        });
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    goToLogin() {
        this.router.navigate(['/sk-official-login']);
    }
}

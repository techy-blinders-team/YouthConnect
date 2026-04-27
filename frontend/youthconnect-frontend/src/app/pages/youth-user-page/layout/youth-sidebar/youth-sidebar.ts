import { Component, inject, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-youth-sidebar',
    imports: [RouterLink, CommonModule],
    templateUrl: './youth-sidebar.html',
    styleUrl: './youth-sidebar.scss',
})
export class YouthSidebar implements OnInit {
    router = inject(Router);
    authService = inject(AuthService);
    userEmail: string = '';
    @Output() collapsedChange = new EventEmitter<boolean>();
    isCollapsed = false;
    isMobileMenuOpen = false;
    isMobile = false;

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        this.userEmail = user?.email || 'user@example.com';
        this.checkScreenSize();
    }

    @HostListener('window:resize')
    onResize() {
        this.checkScreenSize();
    }

    checkScreenSize() {
        this.isMobile = window.innerWidth <= 768;
        if (!this.isMobile) {
            this.isMobileMenuOpen = false;
        }
    }

    isRouteActive(path: string): boolean {
        return this.router.url === path;
    }

    toggleSidebar(): void {
        if (this.isMobile) {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        } else {
            this.isCollapsed = !this.isCollapsed;
            this.collapsedChange.emit(this.isCollapsed);
        }
    }

    closeMobileMenu(): void {
        if (this.isMobile) {
            this.isMobileMenuOpen = false;
        }
    }

    logout(): void {
        this.authService.logout();
    }
}

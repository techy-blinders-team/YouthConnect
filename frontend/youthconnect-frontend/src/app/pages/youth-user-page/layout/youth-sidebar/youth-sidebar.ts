import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
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

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        this.userEmail = user?.email || 'user@example.com';
    }

    isRouteActive(path: string): boolean {
        return this.router.url === path;
    }

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
    }

    logout(): void {
        this.authService.logout();
    }
}

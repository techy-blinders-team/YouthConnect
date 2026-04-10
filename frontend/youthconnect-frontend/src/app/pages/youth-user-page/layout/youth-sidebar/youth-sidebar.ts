import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-youth-sidebar',
    imports: [RouterLink],
    templateUrl: './youth-sidebar.html',
    styleUrl: './youth-sidebar.scss',
})
export class YouthSidebar implements OnInit {
    router = inject(Router);
    authService = inject(AuthService);
    userEmail: string = '';

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        this.userEmail = user?.email || 'user@example.com';
    }

    isRouteActive(path: string): boolean {
        return this.router.url === path;
    }

    logout(): void {
        this.authService.logout();
    }
}

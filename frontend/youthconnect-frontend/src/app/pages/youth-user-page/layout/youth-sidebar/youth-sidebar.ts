import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-youth-sidebar',
    imports: [RouterLink],
    templateUrl: './youth-sidebar.html',
    styleUrl: './youth-sidebar.scss',
})
export class YouthSidebar {
    router = inject(Router);
    authService = inject(AuthService);

    isRouteActive(path: string): boolean {
        return this.router.url === path;
    }

    logout(): void {
        this.authService.logout();
    }
}

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserRole } from "../models/UserRole";
import { AuthUser } from "../models/AuthUser";

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly TOKEN_KEY = 'auth_token';
    private readonly ROLE_KEY = 'auth_role';
    private readonly NAME_KEY = 'auth_name';

    constructor (private router: Router){}

    isLoggedIn(): boolean {
        return !! localStorage.getItem(this.TOKEN_KEY);
    }

    getUserRole(): UserRole | null {
        return (localStorage.getItem(this.ROLE_KEY) as UserRole) ?? null;
    }

    getUsername(): string {
        return localStorage.getItem (this.NAME_KEY) ?? '';
    }

    isYouth(): boolean {
        return this.getUserRole() === 'youth';
    }

    isSkOfficial(): boolean {
        return this.getUserRole() === 'sk-official';
    }

    isAdmin(): boolean {
        return this.getUserRole() === 'admin';
    }


    login(user: AuthUser): void {
        localStorage.setItem(this.TOKEN_KEY, user.token);
        localStorage.setItem(this.NAME_KEY, user.name);
        localStorage.setItem(this.ROLE_KEY, user.role);

        this.redirectByRole(user.role);
    }

    redirectByRole(role: UserRole): void {
        const dashboardRoutes: Record<UserRole, string> = {
            'youth': '/youth/dashboard',
            'sk-official': '/sk-official/dashboard',
            'admin': '/admin/dashboard'
        };

        this.router.navigate([dashboardRoutes[role]]);
    }

    redirectToLogin(role: UserRole | null): void {
        this.router.navigate(['/login']);
    }

}
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserRole } from "../models/UserRole";
import { LoginRequest, LoginResponse, RegistrationRequest, RegistrationResponse } from "../models/auth.model";
import { BehaviorSubject, map, Observable, catchError, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environmentProduction } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly TOKEN_KEY = 'auth_token';
    private readonly ROLE_KEY = 'auth_role';
    private readonly USER_KEY = 'auth_user';

    private apiUrl = `${environmentProduction.apiUrl}/api/auth`;

    private http: HttpClient;
    private router: Router;

    constructor(http: HttpClient, router: Router) {
        this.http = http;
        this.router = router;
    }

    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(
        this.getUserFromStorage()
    );

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;
        const payload = this.parseJwt(token);
        if (!payload) return false;
        return payload.exp * 1000 > Date.now();
    }

    getUserRole(): UserRole | null {
        return (localStorage.getItem(this.ROLE_KEY) as UserRole) ?? null;
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

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
            map(res => {
                if (res.success && res.token) {
                    localStorage.setItem(this.TOKEN_KEY, res.token);
                    localStorage.setItem(this.USER_KEY, JSON.stringify(res));

                    const role = this.mapRoleIdToRole(res.roleId ?? 0);
                    localStorage.setItem(this.ROLE_KEY, role);

                    this.currentUserSubject.next(res);
                }
                return res;
            }),
            catchError(error => {
                console.error('Login error:', error);
                return throwError(() => error);
            })
        );
    }

    register(request: RegistrationRequest): Observable<RegistrationResponse> {
        return this.http.post<RegistrationResponse>(`${this.apiUrl}/register`, request).pipe(
            map(res => {
                if (res.success && res.token) {
                    localStorage.setItem(this.TOKEN_KEY, res.token);
                    localStorage.setItem(this.USER_KEY, JSON.stringify(res));

                    const role = this.mapRoleIdToRole(res.roleId ?? 0);
                    localStorage.setItem(this.ROLE_KEY, role);

                    this.currentUserSubject.next(res);
                }
                // If no token, user needs to login manually after registration
                return res;
            }),
            catchError(error => {
                console.error('Registration error:', error);
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        const role = this.getUserRole();
        
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        
        if (role === 'sk-official') {
            this.router.navigate(['/sk-official/login']);
        } else if (role === 'admin') {
            this.router.navigate(['/admin/login']);
        } else {
            this.router.navigate(['/login']);
        }
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): LoginResponse | null {
        return this.currentUserSubject.value;
    }

    getCurrentUser$(): Observable<LoginResponse | null> {
        return this.currentUserSubject.asObservable();
    }

    redirectByRole(role: UserRole): void {
        const dashboardRoutes: Record<UserRole, string> = {
            'youth': '/youth/dashboard',
            'sk-official': '/sk-official/dashboard',
            'admin': '/admin/dashboard'
        };
        this.router.navigate([dashboardRoutes[role]]);
    }

    redirectToLogin(): void {
        this.router.navigate(['/login']);
    }

    private getUserFromStorage(): LoginResponse | null {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    private parseJwt(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    private mapRoleIdToRole(roleId: number): UserRole {
        const roleMap: Record<number, UserRole> = {
            1: 'youth',
            2: 'sk-official',
            3: 'admin'
        };
        return roleMap[roleId] ?? 'youth';
    }
}
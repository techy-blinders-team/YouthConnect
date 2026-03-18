import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const guestGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) return true;

    // Redirect to appropriate dashboard if already logged in
    const role = auth.getUserRole();
    if (role) {
        auth.redirectByRole(role);
    }

    return false;
}

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { routes } from "../app.routes";

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject (AuthService);
    const router = inject (Router);

    const allowedRoles: string[] = route.data['roles'] ?? [];
    const userRole = auth.getUserRole();

    if (userRole && allowedRoles.includes(userRole)) return true;

    router.navigate(['/login'])

    return false;
}
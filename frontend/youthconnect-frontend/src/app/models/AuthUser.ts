import { UserRole } from "./userRole";

export interface AuthUser {
    token: string;
    role: UserRole;
    name: string;
}
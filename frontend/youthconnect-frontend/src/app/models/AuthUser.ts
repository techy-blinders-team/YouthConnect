import { UserRole } from "./UserRole";

export interface AuthUser {
    token: string;
    role: UserRole;
    name: string;
}
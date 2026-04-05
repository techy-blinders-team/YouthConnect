import { UserRole } from "./UserRole";

export interface AuthUser {
    email: string;
    password: string;
    role: UserRole;
}
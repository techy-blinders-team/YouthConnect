import { Suffix } from './enums';

export interface SkOfficial {
  adminId: number;
  firstName: string;
  lastName: string;
  suffix?: Suffix;
  email: string;
  isActive: boolean;
  createdAt: string;
  role: {
    roleId: number;
    roleName: string;
  };
}

export interface AdminSkOfficialRequest {
  firstName: string;
  lastName: string;
  suffix?: string;
  email: string;
  password: string;
  roleId: number;
  isActive: boolean;
}
import {
  Gender, CivilStatus, Suffix,
  WorkStatus, YouthClassificationType,
  EducationBackground, DocumentType
} from './enums';
import { UserRole } from './UserRole';

export interface DocumentUpload {
  documentType: DocumentType;
  filePath: string;
}

export interface RegistrationRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: Suffix;
  gender: Gender;
  birthday: string; // format: YYYY-MM-DD
  contactNumber: string;
  completeAddress: string;
  civilStatus: CivilStatus;
  email: string;
  password: string;
  youthClassification: YouthClassificationType;
  educationBackground: EducationBackground;
  workStatus: WorkStatus;
  skVoter: boolean;
  nationalVoter: boolean;
  pastVoter: boolean;
  numAttended: number;
  nonAttendedReason?: string;
  // documents: DocumentUpload[];
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: number;
  youthId?: number;
  email?: string;
  token?: string;
  roleId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: number;
  youthId?: number;
  email?: string;
  roleId?: number;
  status?: 'pending' | 'approved' | 'rejected';
  approved?: boolean;
}

export interface SkOfficialLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  adminId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  administratorId?: number;
  email?: string;
  username?: string;
}
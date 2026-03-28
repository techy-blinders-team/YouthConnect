import {
  Gender, CivilStatus, Suffix,
  WorkStatus, YouthClassificationType,
  EducationBackground, DocumentType
} from './enums';

export interface YouthProfile {
  youthId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: Suffix;
  gender: Gender;
  birthday: string;
  contactNumber: string;
  completeAddress: string;
  civilStatus: CivilStatus;
  age?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface YouthClassification {
  youthId: number;
  youthClassification: YouthClassificationType;
  educationBackground: EducationBackground;
  workStatus: WorkStatus;
  skVoter: boolean;
  nationalVoter: boolean;
  pastVoter: boolean;
  numAttendedAssemblies: number;
  nonAttendanceReason?: string;
}

export interface YouthDocument {
  documentId: number;
  youthId: number;
  documentType: DocumentType;
  filePath: string;
  uploadedAt: string;
}

export interface User {
  userId: number;
  youthId: number;
  roleId: number;
  email: string;
  isActive: boolean;
  isApprove: boolean;
  createdAt: string;
}
import { ConcernType, ConcernStatus } from './enums';

export interface ConcernRequest {
  youthId: number;
  typeOfConcern: ConcernType;
  title: string;
  description?: string;
}

export interface ConcernUpdateRequest {
  typeOfConcern: ConcernType;
  title: string;
  description?: string;
}

export interface ConcernResponse {
  concernId: number;
  youthId: number;
  typeOfConcern: ConcernType;
  title: string;
  description?: string;
  status: ConcernStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminConcernUpdateRequest {
  adminId: number;
  updateText: string;
  status?: ConcernStatus;
}
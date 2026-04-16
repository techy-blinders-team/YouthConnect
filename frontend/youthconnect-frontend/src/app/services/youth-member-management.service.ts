import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CivilStatus, Gender, Suffix } from '../models/enums';

export interface YouthUserAccount {
  userId: number;
  youthId: number;
  roleId: number;
  email: string;
  isActive: boolean;
  isApprove: boolean | null;
  createdAt: string;
}

export interface YouthProfileAccount {
  youthId: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: Suffix | null;
  gender: Gender;
  birthday: string;
  contactNumber: string;
  completeAddress: string;
  civilStatus: CivilStatus;
  age?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface YouthMemberListItem {
  userId: number;
  roleId?: number;
  youthId: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  birthday: string;
  contactNumber: string;
  civilStatus: CivilStatus;
  isActive: boolean;
  isApprove: boolean | null;
  createdAt: string;
  middleName?: string | null;
  suffix?: Suffix | null;
  completeAddress?: string;
  youthClassification?: {
    youthClassification?: string;
    educationBackground?: string;
    workStatus?: string;
    skVoter?: boolean;
    nationalVoter?: boolean;
    pastVoter?: boolean;
    numAttended?: number;
    nonAttendedReason?: string;
  };
}

export interface UpdateYouthUserPayload {
  email: string;
  roleId: number;
  active: boolean;
  isApprove: boolean | null;
}

export interface UpdateYouthProfilePayload {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: Suffix | null;
  gender: Gender;
  birthday: string;
  contactNumber: string;
  completeAddress: string;
  civilStatus: CivilStatus;
}

@Injectable({
  providedIn: 'root'
})
export class YouthMemberManagementService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<YouthUserAccount[]> {
    return this.http.get<YouthUserAccount[]>('/api/administrator/users');
  }

  getYouthProfiles(): Observable<YouthProfileAccount[]> {
    return this.http.get<YouthProfileAccount[]>('/api/administrator/youth-profiles');
  }

  updateUser(userId: number, payload: UpdateYouthUserPayload): Observable<YouthUserAccount> {
    return this.http.put<YouthUserAccount>(`/api/administrator/users/${userId}`, {
      email: payload.email,
      roleId: payload.roleId,
      isActive: payload.active,
      isApprove: payload.isApprove
    });
  }

  updateYouthProfile(youthId: number, payload: UpdateYouthProfilePayload): Observable<YouthProfileAccount> {
    return this.http.put<YouthProfileAccount>(`/api/administrator/youth-profiles/${youthId}`, payload);
  }

  deleteYouthProfile(youthId: number): Observable<{ message: string } | string> {
    return this.http.delete<{ message: string } | string>(`/api/administrator/youth-profiles/${youthId}`);
  }
}

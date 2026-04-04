import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminInfo {
  token?: string;
  administratorId?: number;
  email?: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminInfoService {
  private adminInfoSubject = new BehaviorSubject<AdminInfo>({
    token: undefined,
    administratorId: undefined,
    email: undefined,
    username: undefined
  });
  public adminInfo$: Observable<AdminInfo> = this.adminInfoSubject.asObservable();

  constructor() { }

  setAdminInfo(info: AdminInfo): void {
    this.adminInfoSubject.next(info);
  }

  getAdminInfo(): AdminInfo {
    return this.adminInfoSubject.value;
  }

  getEmail(): string | undefined {
    return this.adminInfoSubject.value.email;
  }

  getEmail$(): Observable<string | undefined> {
    return new Observable(observer => {
      this.adminInfo$.subscribe(info => {
        observer.next(info.email);
      });
    });
  }

  clearAdminInfo(): void {
    this.adminInfoSubject.next({
      token: undefined,
      administratorId: undefined,
      email: undefined,
      username: undefined
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private expiryTimer: any;
  private userId: string;
  constructor(private http: HttpClient, private router: Router) {
  }
  private token: string;
  private isUserAuthenticatedSubject = new Subject<boolean>();
  private isAuthenticated = false;

  createUser(user: AuthData) {
    return this.http.post(`${environment.apiUrl}user/signup`, user);
  }

  login(user: AuthData) {
    this.http.post(`${environment.apiUrl}user/login`, user).subscribe((res: any) => {
      if (res.data.token) {
        this.setToken(res.data.token);
        this.isAuthenticated = true;
        this.isUserAuthenticatedSubject.next(true);
        this.userId = res.data.userId;
        const expiresIn = res.data.expiresIn ? Number(res.data.expiresIn) : null;
        if (expiresIn) {
          this.setExpiryTimer(expiresIn);
          const expiresInDate = new Date(new Date().getTime() + expiresIn * 1000);
          this.saveAuthData(res.data.token, expiresInDate, this.userId);
        }

        this.router.navigate(['/']);
      }
    }, err => {
      this.isUserAuthenticatedSubject.next(false);
    });
  }

  getUserId() {
    return this.userId;
  }

  private setExpiryTimer(expiresIn: number) {
    this.expiryTimer = setTimeout(() => {
      this.logOut();
    }, expiresIn * 1000);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.token = token;
  }

  getToken(): string {
    const token = localStorage.getItem('token') || this.token;
    return token;
  }

  isUserAuthenticated() {
    return this.isUserAuthenticatedSubject.asObservable();
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.isUserAuthenticatedSubject.next(false);
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
    }
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expiresIn: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiresInDate = localStorage.getItem('expiresIn');
    const userId = localStorage.getItem('userId');

    if (!token || !expiresInDate) {
      return;
    }

    return {
      token,
      expiresInDate,
      userId
    };
  }

  autoLoginUser() {
    const authData = this.getAuthData();

    if (authData) {
      const expiresIn =  new Date(authData.expiresInDate).getTime() - new Date().getTime();
      if (expiresIn > 0) {
        this.setExpiryTimer(expiresIn / 1000);
        this.isAuthenticated = true;
        this.userId = authData.userId;
        this.isUserAuthenticatedSubject.next(true);
      }
    }
  }
}

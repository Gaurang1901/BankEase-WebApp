import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { resetPasswordModel, User } from '../store/auth.state';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';
import { LoginCredentials } from '../models/login.model';

const TOKEN_KEY = 'auth_token';

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  role: string;
  accountNumber: string;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient);
  hostUrl = inject(ConfigService).getAPIUrl();
  localStorageService = inject(LocalStorageService);
  getToken(): string | null {
    return this.localStorageService.getItem(TOKEN_KEY) as string | null;
  }

  saveToken(token: string): void {
    this.localStorageService.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    this.localStorageService.removeItem(TOKEN_KEY);
  }

  login(credentials: LoginCredentials): Observable<{ data: LoginResponse }> {
    // Mock API endpoints based on login type
    switch (credentials.type) {
      case 'account':
        return this.http.post<{ data: LoginResponse }>(
          `${this.hostUrl}/api/auth/login/account`,
          credentials
        );
      // return of({ token: 'dummy-account-jwt-token' }).pipe(delay(1000));

      case 'otp':
        return this.http.post<{ data: LoginResponse }>(
          `${this.hostUrl}/api/auth/login/otp`,
          credentials
        );
      // return of({ token: 'dummy-otp-jwt-token' }).pipe(delay(1000));

      case 'admin':
        return this.http.post<{ data: LoginResponse }>(
          `${this.hostUrl}/api/auth/signin`,
          credentials
        );
      // return of({ token: 'dummy-admin-jwt-token' }).pipe(delay(1000));

      default:
        return throwError(() => new Error('Invalid login type'));
    }
  }

  sendOTP(accountNumber: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.hostUrl}/api/login/request-otp`,
      { accountNumber }
    );
    // return of({ message: 'OTP sent successfully' }).pipe(delay(1000));
  }

  logout(): void {
    this.removeToken();
  }

  getUserProfile(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    if (token) {
      const user: User = jwtDecode(token);
      return of(user).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid token'));
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.hostUrl}/api/user/forget-password`, {
      email,
    });
  }

  resetPassword(data: resetPasswordModel): Observable<any> {
    return this.http.post(`${this.hostUrl}/api/user/reset-password`, data);
  }

  createUser(userPayload: any): Observable<any> {
    return this.http.post(`${this.hostUrl}/api/auth/signup`, userPayload);
  }

  createAccount(accountPayload: any) {
    return this.http.post(`${this.hostUrl}/api/auth/account`, accountPayload);
  }

  getStates() {
    return this.http.get(`${this.hostUrl}/api/state`);
  }
}

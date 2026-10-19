import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UserSession {
  token: string;
  email: string;
  fullName: string;
  roles: string[];
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api/auth';

  currentUser = signal<UserSession | null>(this.getStoredUser());

  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => {
    const user = this.currentUser();
    return !!user && (user.roles.includes('SuperAdmin') || user.roles.includes('Admin') || user.roles.includes('ProductManager'));
  });

  login(credentials: { email: string; password: string }): Observable<UserSession> {
    return this.http.post<UserSession>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  register(payload: { email: string; password: string; fullName: string; phoneNumber?: string }): Observable<UserSession> {
    return this.http.post<UserSession>(`${this.apiUrl}/register`, payload).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('sc_user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.currentUser()?.token || null;
  }

  private setSession(session: UserSession) {
    localStorage.setItem('sc_user', JSON.stringify(session));
    this.currentUser.set(session);
  }

  private getStoredUser(): UserSession | null {
    try {
      const data = localStorage.getItem('sc_user');
      if (!data) return null;
      return JSON.parse(data) as UserSession;
    } catch {
      return null;
    }
  }
}


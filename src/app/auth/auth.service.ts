import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';
import { API_URL } from '../services/api';

const STORAGE_KEY = 'fshop.auth';

/**
 * Session utilisateur : jeton JWT de l'API, conservé dans le localStorage.
 * Côté serveur (SSR), aucune session : l'utilisateur est considéré déconnecté.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly session = signal<AuthResponse | null>(this.restore());

  readonly user = computed<User | null>(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');

  get token(): string | null {
    return this.session()?.accessToken ?? null;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, request).pipe(tap((res) => this.store(res)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, request).pipe(tap((res) => this.store(res)));
  }

  logout(): void {
    this.session.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private store(response: AuthResponse): void {
    this.session.set(response);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    }
  }

  private restore(): AuthResponse | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as AuthResponse | null;
      if (saved && new Date(saved.expiresAt).getTime() > Date.now()) {
        return saved;
      }
    } catch {
      // Contenu illisible : on repart d'une session vide.
    }
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

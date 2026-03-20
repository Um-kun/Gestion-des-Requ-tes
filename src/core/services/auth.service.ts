import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { User, UserDTO, LoginDTO, RegisterDTO, AuthResponseDTO } from '../models/user.model';
import { ConfigService } from '../config/app.config';
import { LoggerService } from './logger.service';
import { ErrorHandlingService } from './error-handling.service';

/**
 * Service d'authentification refactorisé
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggerService);
  private errorHandler = inject(ErrorHandlingService);
  private config = inject(ConfigService);

  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(this.getStoredToken());
  private isAuthenticatedSignal = signal<boolean>(!!this.tokenSignal());

  // Signals exposés publiquement (read-only)
  readonly currentUser$ = this.currentUserSignal.asReadonly();
  readonly isAuthenticated$ = this.isAuthenticatedSignal.asReadonly();

  constructor() {
    this.initializeFromStorage();
  }

  /**
   * Initialise l'authentification depuis le localStorage
   */
  private initializeFromStorage(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
      this.logger.info('User restored from storage', { email: user.email });
    }
  }

  /**
   * Login
   */
  login(credentials: LoginDTO): void {
    this.logger.info('Attempting login', { matricule: credentials.matricule });
    
    // Mock login - Replace with real API call
    // const apiUrl = `${this.config.getApiUrl()}/auth/login`;
    // this.http.post<AuthResponseDTO>(apiUrl, credentials)
    //   .pipe(
    //     tap(response => this.handleLoginSuccess(response)),
    //     catchError(error => this.handleLoginError(error))
    //   )
    //   .subscribe();

    // Mock implementation
    this.handleMockLogin(credentials);
  }

  /**
   * Register
   */
  register(data: RegisterDTO): void {
    this.logger.info('Attempting registration', { email: data.email });

    // Mock register - Replace with real API call
    if (data.password !== data.confirmPassword) {
      this.errorHandler.showError('Les mots de passe ne correspondent pas');
      return;
    }

    const mockUser: User = {
      id: Math.random().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      matricule: data.matricule,
      role: 'student',
      createdAt: new Date()
    };

    const mockToken = 'mock-token-' + Math.random().toString();

    this.handleLoginSuccess({ user: mockUser, token: mockToken });
  }

  /**
   * Logout
   */
  logout(): void {
    this.logger.info('User logout');
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }

  /**
   * Récupère le token
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  /**
   * Récupère l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.currentUserSignal()?.role === role;
  }

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.currentUserSignal()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Mock login implementation
   */
  private handleMockLogin(credentials: LoginDTO): void {
    let user: User;
    let token: string;

    if (credentials.matricule === 'SUPER') {
      user = {
        id: '999',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'super@university.edu',
        matricule: 'SUPER',
        role: 'superadmin',
        createdAt: new Date()
      };
    } else if (credentials.matricule.startsWith('PROF')) {
      user = {
        id: '200',
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie.curie@university.edu',
        matricule: credentials.matricule,
        role: 'admin',
        createdAt: new Date()
      };
    } else if (credentials.matricule) {
      user = {
        id: '101',
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice.martin@university.edu',
        matricule: credentials.matricule,
        role: 'student',
        createdAt: new Date()
      };
    } else {
      this.errorHandler.showError('Identifiants invalides');
      return;
    }

    token = 'mock-token-' + Math.random().toString();
    this.handleLoginSuccess({ user, token });
  }

  /**
   * Gère le succès du login
   */
  private handleLoginSuccess(response: { user: User; token: string }): void {
    this.tokenSignal.set(response.token);
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);

    // Stockage
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));

    this.logger.info('Login successful', { email: response.user.email });
    this.router.navigate(['/dashboard']);
  }

  /**
   * Gère l'erreur de login
   */
  private handleLoginError(error: any): typeof of {
    this.logger.error('Login error', error);
    this.errorHandler.handleError(error);
    return of(null);
  }

  /**
   * Récupère le token stocké
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
    } catch (e) {
      return null;
    }
  }

  /**
   * Récupère l'utilisateur stocké
   */
  private getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('auth_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  }
}

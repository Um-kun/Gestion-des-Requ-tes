import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'student' | 'admin' | 'superadmin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  role: UserRole;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock logged in user
  currentUser = signal<User | null>(null);

  constructor(private router: Router) {}

  login(matricule: string, password: string): boolean {
    // Mock login logic
    if (matricule === 'SUPER') {
      this.currentUser.set({
        id: '999',
        firstName: 'Jean',
        lastName: 'Dupont',
        matricule: 'SUPER',
        role: 'superadmin'
      });
      this.router.navigate(['/dashboard']);
      return true;
    } 
    
    if (matricule.startsWith('PROF')) {
      this.currentUser.set({
        id: '200',
        firstName: 'Marie',
        lastName: 'Curie',
        matricule: matricule,
        role: 'admin'
      });
      this.router.navigate(['/dashboard']);
      return true;
    }

    if (matricule) {
      this.currentUser.set({
        id: '101',
        firstName: 'Alice',
        lastName: 'Martin',
        matricule: matricule,
        role: 'student'
      });
      this.router.navigate(['/dashboard']);
      return true;
    }
    
    return false;
  }

  register(user: Partial<User>): void {
    // Mock registration
    this.currentUser.set({
      id: Math.random().toString(),
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      matricule: user.matricule || '',
      role: user.role || 'student'
    });
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ErrorHandlingService } from './core/services/error-handling.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex flex-col min-h-screen bg-slate-50">
      <!-- Error Message Display -->
      @if (errorMessage(); as msg) {
        <div class="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {{ msg }}
        </div>
      }

      @if (currentUser(); as user) {
        <div class="flex h-screen overflow-hidden">
          <!-- Sidebar -->
          <aside class="w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col shadow-xl z-20 hidden md:flex">
            <div class="p-6 border-b border-blue-800">
              <h1 class="text-2xl font-bold tracking-tight">UniGrade</h1>
              <p class="text-blue-300 text-xs mt-2">Portail Académique</p>
            </div>

            <nav class="flex-1 py-6 px-4 space-y-2">
              <a routerLink="/dashboard"
                 routerLinkActive="bg-blue-700 border-l-4 border-blue-300"
                 routerLinkActiveOptions="{ exact: true }"
                 class="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Tableau de bord</span>
              </a>

              <a routerLink="/requests"
                 routerLinkActive="bg-blue-700 border-l-4 border-blue-300"
                 class="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Requêtes</span>
              </a>

              @if (isStudent()) {
                <a routerLink="/requests/new"
                   routerLinkActive="bg-blue-700"
                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-all duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nouvelle Requête</span>
                </a>
              }

              <div class="mt-8 px-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Administration
              </div>

              @if (isAdmin()) {
                <a routerLink="/requests"
                   class="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-all duration-200">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Gestion</span>
                </a>
              }
            </nav>

            <!-- User info -->
            <div class="p-4 border-t border-blue-800 bg-blue-950">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                  {{ userInitials() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-xs text-blue-300 truncate capitalize">{{ user.role }}</p>
                </div>
              </div>
              <button (click)="logout()"
                class="w-full mt-3 px-3 py-2 bg-blue-800 hover:bg-blue-700 text-blue-100 rounded text-xs font-semibold transition-colors duration-200">
                Déconnexion
              </button>
            </div>
          </aside>

          <!-- Main Content -->
          <main class="flex-1 flex flex-col overflow-hidden">
            <!-- Mobile Header -->
            <header class="bg-white shadow-sm md:hidden flex items-center justify-between p-4 border-b border-slate-200">
              <h1 class="text-lg font-bold text-blue-900">UniGrade</h1>
              <button (click)="logout()" class="text-blue-600 hover:text-blue-800">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </header>

            <!-- Content Area -->
            <div class="flex-1 overflow-auto">
              <router-outlet></router-outlet>
            </div>
          </main>
        </div>
      } @else {
        <!-- Public Layout -->
        <router-outlet></router-outlet>
      }
    </div>
  `,
  styles: [`
    @keyframes fade-in-out {
      0%, 100% { opacity: 0; }
      10%, 90% { opacity: 1; }
    }

    :global(.animate-fade-in-out) {
      animation: fade-in-out 5s ease-in-out forwards;
    }
  `]
})
export class AppComponent {
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlingService);

  currentUser = this.authService.currentUser$;
  errorMessage = this.errorHandler.error$;

  isStudent = computed(() => this.authService.hasRole('student'));
  isAdmin = computed(() => this.authService.hasAnyRole(['admin', 'superadmin']));

  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  });

  logout(): void {
    this.authService.logout();
  }
}
import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    @if (currentUser()) {
      <div class="flex h-screen bg-slate-50">
        <!-- Sidebar -->
        <aside class="w-64 bg-blue-900 text-white flex flex-col shadow-xl z-20 hidden md:flex">
          <div class="p-6 border-b border-blue-800">
            <h1 class="text-2xl font-bold tracking-tight">UniGrade</h1>
            <p class="text-blue-300 text-xs mt-1">Portail de Gestion</p>
          </div>
          
          <nav class="flex-1 py-6 px-4 space-y-2">
            <a routerLink="/dashboard" routerLinkActive="bg-blue-700 text-white" 
               class="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              <span>Tableau de bord</span>
            </a>
            
            @if (isStudent()) {
              <a routerLink="/new-request" routerLinkActive="bg-blue-700 text-white"
                 class="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span>Nouvelle Requête</span>
              </a>
            }

            <div class="mt-8 px-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Compte
            </div>
            
            <button (click)="logout()" class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors duration-200 text-left">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Déconnexion</span>
            </button>
          </nav>

          <div class="p-4 border-t border-blue-800 bg-blue-950">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                {{ userInitials() }}
              </div>
              <div class="overflow-hidden">
                <p class="text-sm font-medium text-white truncate">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</p>
                <p class="text-xs text-blue-300 truncate capitalize">{{ currentUser()?.role }}</p>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col overflow-hidden">
          <!-- Mobile Header -->
          <header class="bg-white shadow-sm md:hidden flex items-center justify-between p-4 z-10">
            <h1 class="text-lg font-bold text-blue-900">UniGrade</h1>
            <button (click)="logout()" class="text-blue-600 hover:text-blue-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </header>

          <div class="flex-1 overflow-auto p-4 md:p-8 relative">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    } @else {
      <!-- Public Layout (Login/Register) -->
      <div class="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
           <div class="text-center mb-6">
             <h2 class="text-4xl font-extrabold text-blue-900">UniGrade</h2>
             <p class="mt-2 text-sm text-slate-600">Gestion des requêtes académiques</p>
           </div>
        </div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
           <router-outlet></router-outlet>
        </div>
      </div>
    }
  `
})
export class AppComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  
  isStudent = computed(() => this.currentUser()?.role === 'student');
  
  userInitials = computed(() => {
    const u = this.currentUser();
    if (!u) return '';
    return (u.firstName[0] + u.lastName[0]).toUpperCase();
  });

  logout() {
    this.authService.logout();
  }
}
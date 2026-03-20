import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4">
      <div class="text-center">
        <svg class="w-32 h-32 mx-auto mb-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Accès refusé</h1>
        <p class="text-xl text-slate-600 mb-8">Vous n'avez pas les permissions pour accéder à cette page.</p>
        <a routerLink="/dashboard"
           class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Retour au tableau de bord
        </a>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}

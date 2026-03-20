import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RequestService } from '../../../core/services/request.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-900 mb-2">Bienvenue, {{ currentUser()?.firstName }}!</h1>
        <p class="text-slate-600">Gestion centralisée de vos requêtes académiques</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">Total</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats().total }}</p>
            </div>
            <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">En attente</p>
              <p class="text-3xl font-bold text-yellow-600">{{ stats().pending }}</p>
            </div>
            <svg class="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">Validées</p>
              <p class="text-3xl font-bold text-green-600">{{ stats().validated }}</p>
            </div>
            <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-600 text-sm font-medium">Rejetées</p>
              <p class="text-3xl font-bold text-red-600">{{ stats().rejected }}</p>
            </div>
            <svg class="w-12 h-12 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        @if (isStudent()) {
          <a routerLink="/requests/new"
             class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Créer une requête
          </a>
        }
      </div>

      <!-- Recent Requests -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-slate-200">
          <h2 class="text-xl font-semibold text-slate-900">Requêtes récentes</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Étudiant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Sujet</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              @for (request of recentRequests(); track request.id) {
                <tr class="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-blue-600">{{ request.id }}</td>
                  <td class="px-6 py-4 text-sm text-slate-900">{{ request.studentName }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ request.subject }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                          [ngClass]="getTypeClass(request.type)">
                      {{ request.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                          [ngClass]="getStatusClass(request.status)">
                      {{ request.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ request.createdAt | date: 'dd/MM/yyyy' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private requestService = inject(RequestService);
  protected authService = inject(AuthService);

  currentUser = this.authService.currentUser$;
  isStudent = this.authService.hasRole.bind(this.authService);

  stats = computed(() => this.requestService.stats$());

  recentRequests = computed(() =>
    this.requestService.getRequests().slice(0, 5)
  );

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Validée': 'bg-green-100 text-green-800',
      'Rejetée': 'bg-red-100 text-red-800',
      'Transmise': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-slate-100 text-slate-800';
  }

  getTypeClass(type: string): string {
    return 'bg-slate-100 text-slate-800';
  }
}

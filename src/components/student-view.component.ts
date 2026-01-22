import { Component, inject, computed } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-view',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Mes Requêtes</h2>
        <a routerLink="/new-request" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Nouvelle Requête
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <p class="text-sm font-medium text-slate-500">Total Requêtes</p>
           <p class="text-3xl font-bold text-blue-900 mt-2">{{ myRequests().length }}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <p class="text-sm font-medium text-slate-500">En attente</p>
           <p class="text-3xl font-bold text-amber-500 mt-2">{{ pendingCount() }}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <p class="text-sm font-medium text-slate-500">Validées</p>
           <p class="text-3xl font-bold text-green-600 mt-2">{{ validatedCount() }}</p>
        </div>
      </div>

      <!-- Requests List -->
      <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (req of myRequests(); track req.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ req.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ req.subject }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.date | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [class]="getStatusClass(req.status)">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                    Voir détails
                  </td>
                </tr>
              }
              @if (myRequests().length === 0) {
                <tr>
                   <td colspan="6" class="px-6 py-10 text-center text-gray-500 text-sm">
                     Aucune requête soumise pour le moment.
                   </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentViewComponent {
  dataService = inject(DataService);
  authService = inject(AuthService);

  myRequests = computed(() => {
    const userId = this.authService.currentUser()?.id;
    return this.dataService.requests().filter(r => r.studentId === userId);
  });

  pendingCount = computed(() => this.myRequests().filter(r => r.status === 'En attente').length);
  validatedCount = computed(() => this.myRequests().filter(r => r.status === 'Validée').length);

  getStatusClass(status: string): string {
    switch (status) {
      case 'Validée': return 'bg-green-100 text-green-800';
      case 'Rejetée': return 'bg-red-100 text-red-800';
      case 'Transmise': return 'bg-blue-100 text-blue-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  }
}
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../core/services/request.service';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-slate-900">Liste des requêtes</h1>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-100 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Étudiant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Sujet</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Priorité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              @for (request of requests(); track request.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-blue-600">{{ request.id }}</td>
                  <td class="px-6 py-4 text-sm text-slate-900">{{ request.studentName }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ request.subject }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                      {{ request.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded text-xs font-semibold"
                          [ngClass]="getPriorityClass(request.priority)">
                      {{ request.priority }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                          [ngClass]="getStatusClass(request.status)">
                      {{ request.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ request.createdAt | date: 'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 text-sm">
                    <a [routerLink]="['/requests', request.id]"
                       class="text-blue-600 hover:text-blue-800 font-medium">
                      Voir
                    </a>
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
export class RequestListComponent {
  private requestService = inject(RequestService);

  requests = computed(() => this.requestService.getRequests());

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Validée': 'bg-green-100 text-green-800',
      'Rejetée': 'bg-red-100 text-red-800',
      'Transmise': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-slate-100 text-slate-800';
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      'low': 'bg-slate-100 text-slate-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-slate-100 text-slate-800';
  }
}

import { Component, inject, computed, signal } from '@angular/core';
import { DataService, Request } from '../services/data.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
           <h2 class="text-2xl font-bold text-gray-900">Gestion de Classe</h2>
           <p class="text-sm text-slate-500 mt-1">Gérez les réclamations de vos étudiants</p>
        </div>
        <div class="flex gap-2">
           <select class="border-gray-300 border rounded-md text-sm p-2 shadow-sm" [(ngModel)]="filterStatus">
             <option value="All">Tous les statuts</option>
             <option value="En attente">En attente</option>
             <option value="Validée">Validée</option>
           </select>
        </div>
      </div>

      <!-- KPI -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
           <p class="text-xs font-semibold text-slate-400 uppercase">Total</p>
           <p class="text-2xl font-bold text-slate-700">{{ requests().length }}</p>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border-l-4 border-amber-400">
           <p class="text-xs font-semibold text-slate-400 uppercase">En attente</p>
           <p class="text-2xl font-bold text-slate-700">{{ pendingCount() }}</p>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500">
           <p class="text-xs font-semibold text-slate-400 uppercase">Validées</p>
           <p class="text-2xl font-bold text-slate-700">{{ validatedCount() }}</p>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500">
           <p class="text-xs font-semibold text-slate-400 uppercase">Tps Moyen</p>
           <p class="text-2xl font-bold text-slate-700">2.4j</p>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white shadow-lg rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (req of filteredRequests(); track req.id) {
                <tr class="hover:bg-slate-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                        {{ req.studentName.charAt(0) }}
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ req.studentName }}</div>
                        <div class="text-xs text-gray-500">{{ req.matricule }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ req.subject }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ req.date | date:'shortDate' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [class]="getStatusClass(req.status)">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button (click)="updateStatus(req.id, 'Validée')" class="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded hover:bg-green-100 transition-colors" title="Valider">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                      <button (click)="updateStatus(req.id, 'Rejetée')" class="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded hover:bg-red-100 transition-colors" title="Rejeter">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      <button (click)="updateStatus(req.id, 'Transmise')" class="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded hover:bg-blue-100 transition-colors" title="Transmettre">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </button>
                    </div>
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
export class AdminViewComponent {
  dataService = inject(DataService);
  
  requests = this.dataService.requests;
  filterStatus = signal('All');

  filteredRequests = computed(() => {
    const s = this.filterStatus();
    if (s === 'All') return this.requests();
    return this.requests().filter(r => r.status === s);
  });

  pendingCount = computed(() => this.requests().filter(r => r.status === 'En attente').length);
  validatedCount = computed(() => this.requests().filter(r => r.status === 'Validée').length);

  updateStatus(id: string, status: Request['status']) {
    this.dataService.updateStatus(id, status);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Validée': return 'bg-green-100 text-green-800';
      case 'Rejetée': return 'bg-red-100 text-red-800';
      case 'Transmise': return 'bg-blue-100 text-blue-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  }
}
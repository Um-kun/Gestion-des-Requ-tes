import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RequestService } from '../../../core/services/request.service';
import { Request } from '../../../core/models/request.model';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8">
      @if (request(); as req) {
        <div class="mb-6">
          <a routerLink="/requests" class="text-blue-600 hover:text-blue-800">← Retour</a>
          <h1 class="text-3xl font-bold text-slate-900 mt-2">{{ req.id }}</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h2 class="text-xl font-semibold text-slate-900 mb-4">Détails</h2>
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-slate-600">Matière/Sujet</p>
                  <p class="text-lg font-semibold text-slate-900">{{ req.subject }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Type de requête</p>
                  <p class="text-lg font-semibold text-slate-900">{{ req.type }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Description</p>
                  <p class="text-slate-900">{{ req.description }}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600">Notes/Commentaires</p>
                  <p class="text-slate-900">{{ req.notes || 'Aucune note' }}</p>
                </div>
              </div>
            </div>

            <!-- Student Info -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-slate-900 mb-4">Étudiant</h2>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-slate-600">Nom:</span>
                  <span class="font-semibold">{{ req.studentName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Email:</span>
                  <span class="font-semibold">{{ req.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Matricule:</span>
                  <span class="font-semibold">{{ req.matricule }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Sidebar -->
          <div class="md:col-span-1">
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Statut</h2>
              <div class="mb-6">
                <span class="px-4 py-2 rounded-full text-sm font-semibold w-full block text-center"
                      [ngClass]="getStatusClass(req.status)">
                  {{ req.status }}
                </span>
              </div>

              <div class="space-y-4">
                <div>
                  <p class="text-xs text-slate-600 uppercase font-semibold">Priorité</p>
                  <p class="text-sm font-semibold capitalize">{{ req.priority }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-600 uppercase font-semibold">Créée</p>
                  <p class="text-sm font-semibold">{{ req.createdAt | date: 'dd/MM/yyyy HH:mm' }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-600 uppercase font-semibold">Modifiée</p>
                  <p class="text-sm font-semibold">{{ req.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</p>
                </div>
                @if (req.resolvedAt) {
                  <div>
                    <p class="text-xs text-slate-600 uppercase font-semibold">Résolue</p>
                    <p class="text-sm font-semibold">{{ req.resolvedAt | date: 'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-slate-600">Requête non trouvée</p>
        </div>
      }
    </div>
  `
})
export class RequestDetailComponent {
  private requestService = inject(RequestService);
  private route = inject(ActivatedRoute);

  request = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.requestService.getRequestById(id) : undefined;
  });

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Validée': 'bg-green-100 text-green-800',
      'Rejetée': 'bg-red-100 text-red-800',
      'Transmise': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-slate-100 text-slate-800';
  }
}

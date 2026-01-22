import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, Request } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Soumettre une requête</h2>
        <p class="mt-2 text-gray-600">Remplissez le formulaire ci-dessous pour signaler une erreur de note.</p>
      </div>

      <div class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <form (ngSubmit)="onSubmit()" class="p-8 space-y-6">
          
          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Matière / Cours</label>
            <input 
              type="text" 
              name="subject" 
              [(ngModel)]="subject" 
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
              placeholder="Ex: Algèbre Linéaire"
            >
          </div>

          <!-- Type -->
          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Type de réclamation</label>
             <div class="grid grid-cols-2 gap-3">
               @for (t of types; track t) {
                 <div 
                   class="cursor-pointer border rounded-lg p-3 text-center text-sm font-medium transition-all"
                   [class]="type === t ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'"
                   (click)="type = t"
                 >
                   {{ t }}
                 </div>
               }
             </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
            <textarea 
              rows="4" 
              name="description" 
              [(ngModel)]="description" 
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Expliquez le problème..."
            ></textarea>
          </div>

          <!-- File Upload (Mock) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Justificatifs (Optionnel)</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Télécharger un fichier</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only">
                  </label>
                  <p class="pl-1">ou glisser-déposer</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 5MB</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
             <button type="button" (click)="cancel()" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3">
               Annuler
             </button>
             <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
               Soumettre la requête
             </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class RequestFormComponent {
  router = inject(Router);
  dataService = inject(DataService);
  authService = inject(AuthService);

  subject = '';
  type: Request['type'] = 'Erreur de saisie';
  description = '';
  types: Request['type'][] = ['Erreur de saisie', 'Absence de note', 'Incohérence', 'Autre'];

  onSubmit() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.dataService.addRequest({
      studentId: user.id,
      studentName: `${user.firstName} ${user.lastName}`,
      matricule: user.matricule,
      subject: this.subject,
      type: this.type,
      description: this.description,
      attachments: false // Mocked
    });
    
    this.router.navigate(['/dashboard']);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
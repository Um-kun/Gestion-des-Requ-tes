import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { RequestService } from '../../../core/services/request.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-slate-900">Créer une nouvelle requête</h1>
        <p class="text-slate-600 mt-2">Remplissez le formulaire ci-dessous pour soumettre votre requête</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Matière/Sujet *</label>
            <input
              type="text"
              formControlName="subject"
              placeholder="Ex: Mathématiques"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            @if (form.get('subject')?.invalid && form.get('subject')?.touched) {
              <p class="text-red-600 text-sm mt-1">Veuillez entrer un sujet</p>
            }
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Type de requête *</label>
            <select
              formControlName="type"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez un type</option>
              <option value="Erreur de saisie">Erreur de saisie</option>
              <option value="Absence de note">Absence de note</option>
              <option value="Incohérence">Incohérence</option>
              <option value="Autre">Autre</option>
            </select>
            @if (form.get('type')?.invalid && form.get('type')?.touched) {
              <p class="text-red-600 text-sm mt-1">Veuillez sélectionner un type</p>
            }
          </div>
        </div>

        <!-- Priority -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
          <div class="flex gap-4">
            @for (priority of ['low', 'medium', 'high']; track priority) {
              <label class="flex items-center">
                <input
                  type="radio"
                  formControlName="priority"
                  [value]="priority"
                  class="w-4 h-4"
                />
                <span class="ml-2 text-sm text-slate-700 capitalize">{{ priority }}</span>
              </label>
            }
          </div>
        </div>

        <!-- Description -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-slate-700 mb-1">Description détaillée *</label>
          <textarea
            formControlName="description"
            rows="6"
            placeholder="Décrivez votre requête en détail..."
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          @if (form.get('description')?.invalid && form.get('description')?.touched) {
            <p class="text-red-600 text-sm mt-1">Veuillez entrer une description</p>
          }
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex gap-4">
          <button
            type="submit"
            [disabled]="form.invalid || isSubmitting()"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            @if (isSubmitting()) {
              <span class="flex items-center justify-center">
                <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                </svg>
                Envoi en cours...
              </span>
            } @else {
              Soumettre la requête
            }
          </button>
          <a
            routerLink="/requests"
            class="px-4 py-2 bg-slate-300 text-slate-700 rounded-md hover:bg-slate-400 transition-colors"
          >
            Annuler
          </a>
        </div>
      </form>
    </div>
  `
})
export class RequestFormComponent {
  private requestService = inject(RequestService);
  private authService = inject(AuthService);
  private logger = inject(LoggerService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form: FormGroup;
  isSubmitting = computed(() => false);

  constructor() {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['medium']
    });
  }

  submit(): void {
    if (this.form.valid) {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      const newRequest = this.requestService.createRequest({
        ...this.form.value,
        studentId: user.id,
        studentName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        matricule: user.matricule
      });

      this.logger.info('Request created', { requestId: newRequest.id });
      this.router.navigate(['/requests']);
    }
  }
}

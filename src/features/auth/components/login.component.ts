import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-blue-900 text-center">Connexion</h2>
        <p class="mt-2 text-center text-slate-600 text-sm">Accédez à votre tableau de bord</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="login()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700">Matricule</label>
          <input
            type="text"
            formControlName="matricule"
            placeholder="Entrez votre matricule"
            class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          @if (form.get('matricule')?.invalid && form.get('matricule')?.touched) {
            <p class="mt-1 text-sm text-red-600">{{ form.get('matricule')?.errors | json }}</p>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Mot de passe</label>
          <input
            type="password"
            formControlName="password"
            placeholder="••••••••"
            class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            formControlName="rememberMe"
            class="h-4 w-4 text-blue-600"
          />
          <label for="rememberMe" class="ml-2 text-sm text-slate-700">Se souvenir de moi</label>
        </div>

        <button
          type="submit"
          [disabled]="form.invalid"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Connexion
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        Pas encore inscrit ?
        <a routerLink="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
          S'inscrire
        </a>
      </p>

      <div class="mt-6 p-3 bg-blue-50 rounded text-xs text-slate-700">
        📝 <strong>Demo:</strong> Utilisez SUPER, PROF001, ou tout autre matricule
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      matricule: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  login(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    }
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorHandlingService } from '../../../core/services/error-handling.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-blue-900 text-center">S'inscrire</h2>
        <p class="mt-2 text-center text-slate-600 text-sm">Créez votre compte UniGrade</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="register()" class="space-y-4">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium text-slate-700">Prénom</label>
            <input
              type="text"
              formControlName="firstName"
              placeholder="Prénom"
              class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Nom</label>
            <input
              type="text"
              formControlName="lastName"
              placeholder="Nom"
              class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            formControlName="email"
            placeholder="email@university.edu"
            class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Matricule</label>
          <input
            type="text"
            formControlName="matricule"
            placeholder="Votre matricule étudiant"
            class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              type="password"
              formControlName="password"
              placeholder="••••••••"
              class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Confirmer</label>
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="••••••••"
              class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          [disabled]="form.invalid"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          S'inscrire
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        Vous avez un compte ?
        <a routerLink="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
          Se connecter
        </a>
      </p>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlingService);
  private fb = inject(FormBuilder);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  register(): void {
    if (this.form.valid) {
      this.authService.register(this.form.value);
    }
  }
}

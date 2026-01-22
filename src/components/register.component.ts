import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Prénom</label>
            <input type="text" [(ngModel)]="firstName" name="firstName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" [(ngModel)]="lastName" name="lastName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Matricule</label>
          <input type="text" [(ngModel)]="matricule" name="matricule" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>

        <div>
           <label class="block text-sm font-medium text-gray-700">Rôle</label>
           <select [(ngModel)]="role" name="role" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
             <option value="student">Étudiant</option>
             <option value="admin">Professeur (Admin Classe)</option>
           </select>
           @if (role === 'admin') {
             <p class="mt-1 text-xs text-amber-600">⚠ Nécessite validation d'un super admin.</p>
           }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input type="password" [(ngModel)]="password" name="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>

        <div class="bg-blue-50 p-3 rounded-md">
           <p class="text-xs text-blue-700">
             Note: Les comptes Super Administrateurs ne peuvent être créés que depuis le tableau de bord Super Admin.
           </p>
        </div>

        <div>
          <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            S'inscrire
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <a routerLink="/login" class="text-sm font-medium text-blue-600 hover:text-blue-500">
          Déjà un compte ? Se connecter
        </a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  authService = inject(AuthService);
  
  firstName = '';
  lastName = '';
  matricule = '';
  password = '';
  role: UserRole = 'student';

  onSubmit() {
    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      matricule: this.matricule,
      role: this.role
    });
  }
}
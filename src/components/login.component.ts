import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label for="matricule" class="block text-sm font-medium text-gray-700">Matricule</label>
          <div class="mt-1">
            <input 
              id="matricule" 
              name="matricule" 
              type="text" 
              required 
              [(ngModel)]="matricule"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: ETU202401 ou PROF001"
            >
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <div class="mt-1">
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              [(ngModel)]="password"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label for="remember_me" class="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Mot de passe oublié ?</a>
          </div>
        </div>

        <div>
          <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Se connecter
          </button>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3">
          <a routerLink="/register" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Créer un compte
          </a>
        </div>
        
        <div class="mt-6 p-4 bg-blue-50 rounded-md text-xs text-blue-800">
           <p><strong>Comptes démo :</strong></p>
           <ul class="list-disc pl-4 mt-1">
             <li>Étudiant: n'importe quel matricule (ex: ETU1)</li>
             <li>Professeur: matricule commençant par PROF (ex: PROF01)</li>
             <li>Super Admin: matricule "SUPER"</li>
           </ul>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  matricule = '';
  password = '';

  onSubmit() {
    this.authService.login(this.matricule, this.password);
  }
}
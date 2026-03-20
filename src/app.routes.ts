import { Routes } from '@angular/router';
import { authGuard, publicGuard, roleGuardFactory } from './core/guards';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth routes (public)
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/components/login.component').then(
            m => m.LoginComponent
          )
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/components/register.component').then(
            m => m.RegisterComponent
          )
      }
    ]
  },

  // Dashboard route
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/components/dashboard.component').then(
        m => m.DashboardComponent
      )
  },

  // Requests routes
  {
    path: 'requests',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/requests/components/request-list.component').then(
            m => m.RequestListComponent
          )
      },
      {
        path: 'new',
        canActivate: [roleGuardFactory(['student'])],
        loadComponent: () =>
          import('./features/requests/components/request-form.component').then(
            m => m.RequestFormComponent
          )
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/requests/components/request-detail.component').then(
            m => m.RequestDetailComponent
          )
      }
    ]
  },

  // Redirect old login/register paths
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  { path: 'new-request', redirectTo: 'requests/new' },

  // Unauthorized page
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized.component').then(
        m => m.UnauthorizedComponent
      )
  },

  // 404 fallback
  { path: '**', redirectTo: 'dashboard' }
];
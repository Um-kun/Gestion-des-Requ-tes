import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StudentViewComponent } from './student-view.component';
import { AdminViewComponent } from './admin-view.component';
import { SuperAdminViewComponent } from './super-admin-view.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StudentViewComponent, AdminViewComponent, SuperAdminViewComponent],
  template: `
    @if (role() === 'student') {
      <app-student-view />
    } 
    @else if (role() === 'admin') {
      <app-admin-view />
    }
    @else if (role() === 'superadmin') {
      <app-super-admin-view />
    }
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
  role = computed(() => this.authService.currentUser()?.role);
}
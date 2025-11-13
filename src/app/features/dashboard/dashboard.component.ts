import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { User } from '../../core/auth/store/auth.state';
import { AdminDashboardComponent } from '../admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../main/user-dashboard/user-dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [AdminDashboardComponent, UserDashboardComponent,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AuthService);
  userData: User | null = null;

  ngOnInit() {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        console.log('User Profile:', profile);
        this.userData = profile;
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }
}

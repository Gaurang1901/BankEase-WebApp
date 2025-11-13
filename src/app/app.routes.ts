import { Routes } from '@angular/router';

import { authGuard } from './core/auth/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RoleGuard } from './core/auth/guards/role.guards.';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/authentication/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/authentication/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      // {
      //   path: 'user',
      //   canActivate: [RoleGuard],
      //   children: [{}],
      // },
      // {
      //   path: 'admin',
      //   canActivate: [RoleGuard],
      //   children: [{}],
      // },
    ],
  },
];

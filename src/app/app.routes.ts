import { Routes } from '@angular/router';

import { authGuard } from './core/auth/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RoleGuard } from './core/auth/guards/role.guard';

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
      {
        path: 'user',
        // canActivateChild: [RoleGuard],
        children: [
          {
            path: '',
            redirectTo: 'user-account',
            pathMatch: 'full',
          },
          {
            path: 'account',
            loadComponent: () =>
              import(
                './features/main/account-management/components/account-overview/account-overview.component'
              ).then((m) => m.AccountOverviewComponent),
          },
          {
            path: 'transactions',
            loadComponent: () =>
              import(
                './features/main/transaction-management/components/transactions-page/transactions-page.component'
              ).then((m) => m.TransactionsPageComponent),
          },
          {
            path: 'cards',
            loadComponent: () =>
              import(
                './features/main/card-management/components/card-management/card-management.component'
              ).then((m) => m.CardManagementComponent),
          },
          {
            path: 'loans',
            loadComponent: () =>
              import(
                './features/main/loan-management/components/loan-management/loan-management.component'
              ).then((m) => m.LoanManagementComponent),
          },
          {
            path: 'budgets',
            loadComponent: () =>
              import(
                './features/main/budget-system/budget-system.component'
              ).then((m) => m.BudgetSystemComponent),
          },
        ],
      },
      // {
      //   path: 'admin',
      //   canActivate: [RoleGuard],
      //   children: [{}],
      // },
    ],
  },
];

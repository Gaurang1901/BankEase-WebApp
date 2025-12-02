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
      {
        path: 'admin',
        // canActivate: [RoleGuard],
        children: [
          {
            path: 'loan-interest-rates',
            loadComponent: () =>
              import(
                './features/admin/masters/loan-interest-rate/components/loan-interest-rate-list/loan-interest-rate-list.component'
              ).then((m) => m.LoanInterestRateListComponent),
          },
          {
            path: 'loan-interest-rates-add',
            loadComponent: () =>
              import(
                './features/admin/masters/loan-interest-rate/components/loan-interest-rate-create/loan-interest-rate-create.component'
              ).then((m) => m.LoanInterestRateCreateComponent),
          },
          {
            path: 'state-list',
            loadComponent: () =>
              import(
                './features/admin/masters/state/components/state-list/state-list.component'
              ).then((m) => m.StateListComponent),
          },
          {
            path: 'state-add',
            loadComponent: () =>
              import(
                './features/admin/masters/state/components/state-create/state-create.component'
              ).then((m) => m.StateCreateComponent),
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./features/admin/users/users.component').then(
                (m) => m.UsersComponent
              ),
          },
          {
            path: 'accounts',
            loadComponent: () =>
              import(
                './features/admin/accounts/account-list/account-list.component'
              ).then((m) => m.AccountListComponent),
          },
          {
            path: 'transactions',
            loadComponent: () =>
              import(
                './features/admin/transactions/transaction-list/transaction-list.component'
              ).then((m) => m.TransactionListComponent),
          },

          {
            path: 'loans',
            loadComponent: () =>
              import(
                './features/admin/loan-system/pages/loan-list/loan-list.component'
              ).then((m) => m.LoanListComponent),
          },
          {
            path: 'loan-pending-list',
            loadComponent: () =>
              import(
                './features/admin/loan-system/pages/pending-approval-loans/pending-approval-loans.component'
              ).then((m) => m.PendingApprovalLoansComponent),
          },
          {
            path: 'loans/details/:id',
            loadComponent: () =>
              import(
                './features/admin/loan-system/pages/loan-details/loan-details.component'
              ).then((m) => m.LoanDetailsComponent),
          },
          {
            path: 'cards',
            loadComponent: () =>
              import(
                './features/admin/card-system/pages/card-list/card-list.component'
              ).then((m) => m.CardListComponent),
          },
          {
            path: 'cards-pending-list',
            loadComponent: () =>
              import(
                './features/admin/card-system/pages/pending-approval-cards/card-approval.component'
              ).then((m) => m.PendingApprovalCardComponent),
          },
          {
            path: 'loans/details/:id',
            loadComponent: () =>
              import(
                './features/admin/loan-system/pages/loan-details/loan-details.component'
              ).then((m) => m.LoanDetailsComponent),
          },
        ],
      },
      {
        path: 'work-in-progress',
        loadComponent: () =>
          import(
            './components/work-in-progress/work-in-progress.component'
          ).then((m) => m.WorkInProgressComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'work-in-progress',
  },
];

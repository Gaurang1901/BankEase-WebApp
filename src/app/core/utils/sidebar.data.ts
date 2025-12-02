import { MasterSidebarItem } from '../../components/sidebar/sidebar.component';

export const sideBarItems: MasterSidebarItem[] = [
  {
    routeLink: '',
    icon: 'pi pi-home',
    label: 'Dashboard',
  },
  {
    routeLink: '/admin/users',
    icon: 'pi pi-users',
    label: 'Users',
    permission: {
      resource: 'userModule',
      action: 'create',
    },
  },
  {
    routeLink: '/admin/accounts',
    icon: 'pi pi-wallet',
    label: 'Accounts',
    permission: {
      resource: 'accountModule',
      action: 'view',
    },
  },
  {
    routeLink: '/admin/transactions',
    icon: 'pi pi-arrow-right-arrow-left',
    label: 'Transactions',
    permission: {
      resource: 'transactionModule',
      action: 'view',
    },
  },
  {
    icon: 'pi pi-dollar',
    label: 'Loans',
    permission: {
      resource: 'loanModule',
      action: 'view',
    },
    children: [
      {
        icon: 'pi pi-check-circle',
        label: 'Pending Approvals',
        routeLink: '/admin/loan-pending-list',
      },
      {
        icon: 'pi pi-dollar',
        label: 'Loan List',
        routeLink: '/admin/loans',
      },
    ],
  },
  {
    icon: 'pi pi-credit-card',
    label: 'Cards',
    permission: {
      resource: 'cardModule',
      action: 'view',
    },
    children: [
      {
        icon: 'pi pi-check-circle',
        label: 'Pending Approvals',
        routeLink: '/admin/cards-pending-list',
      },
      {
        icon: 'pi pi-credit-card',
        label: 'Card List',
        routeLink: '/admin/cards',
      },
    ],
  },
  {
    icon: 'pi pi-server',
    label: 'Master',
    permission: {
      resource: 'masterModule',
      action: 'create',
    },
    children: [
      {
        icon: 'pi pi-briefcase',
        label: 'Loan Interest Rates',
        routeLink: '/admin/loan-interest-rates',
      },
      {
        icon: 'pi pi-th-large',
        label: 'States',
        routeLink: '/admin/state-list',
      },
    ],
  },
  {
    routeLink: 'user/account',
    icon: 'pi pi-wallet',
    label: 'My Account',
    permission: {
      resource: 'myAccountModule',
      action: 'view',
    },
  },
  {
    routeLink: 'user/transactions',
    icon: 'pi pi-arrow-right-arrow-left',
    label: 'My Transactions',
    permission: {
      resource: 'myTransactionModule',
      action: 'view',
    },
  },
  {
    routeLink: 'user/cards',
    icon: 'pi pi-credit-card',
    label: 'My Cards',
    permission: {
      resource: 'myCardModule',
      action: 'view',
    },
  },
  {
    routeLink: 'user/loans',
    icon: 'pi pi-dollar',
    label: 'My Loans',
    permission: {
      resource: 'myLoanModule',
      action: 'view',
    },
  },
  {
    routeLink: 'user/savings-goals',
    icon: 'pi pi-money-bill',
    label: 'My Savings Goals',
    permission: {
      resource: 'mySavingsGoalModule',
      action: 'view',
    },
  },
  {
    routeLink: 'user/analytics',
    icon: 'pi pi-chart-bar',
    label: 'Analytics',
    permission: {
      resource: 'analyticsModule',
      action: 'view',
    },
  },
  {
    routeLink: 'user/budgets',
    icon: 'pi pi-wallet',
    label: 'Budgets',
    permission: {
      resource: 'budgetModule',
      action: 'view',
    },
  },
];

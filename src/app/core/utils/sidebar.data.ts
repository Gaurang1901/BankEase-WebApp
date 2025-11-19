import { MasterSidebarItem } from '../../components/sidebar/sidebar.component';

export const sideBarItems: MasterSidebarItem[] = [
  {
    routeLink: '',
    icon: 'pi pi-home',
    label: 'Dashboard',
  },
  {
    routeLink: 'users',
    icon: 'pi pi-users',
    label: 'Users',
    permission: {
      resource: 'userModule',
      action: 'create',
    },
  },
  {
    routeLink: 'accounts',
    icon: 'pi pi-wallet',
    label: 'Accounts',
    permission: {
      resource: 'accountModule',
      action: 'view',
    },
  },
  {
    routeLink: 'transactions',
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
        routeLink: 'loan-pending-list ',
      },
      {
        icon: 'pi pi-dollar',
        label: 'Loan List',
        routeLink: 'loans',
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
        routeLink: 'loan-interest-rates',
      },
      {
        icon: 'pi pi-bank',
        label: 'States',
        routeLink: 'state-list',
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
  {
    routeLink: 'user/statements',
    icon: 'pi pi-file',
    label: 'Statements',
    permission: {
      resource: 'statementModule',
      action: 'view',
    },
  },
];

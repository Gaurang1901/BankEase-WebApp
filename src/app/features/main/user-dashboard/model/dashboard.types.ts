export interface UserDashboardKpiResponse {
  totalAccounts: number;
  totalCards: number;
  totalFinancialGoals: number;
  totalTransactions: number;
}

// Interface for the component's input data, derived from the API response
export interface KpiCard {
  title: string;
  value: number;
  icon: string;
  colorClass: string; // Tailwind CSS class for background color
}

export interface UsersMonthlyTransaction {
  month: string;
  totalTransactions: number;
}

export interface BalanceTrend {
  month: string;
  averageBalance: number;
}

export interface UserRecenttTransactions {
  transactionId: string;
  type: 'WITHDRAW' | 'DEPOSIT' | 'TRANSFER';
  amount: number;
  transactionDate: Date | string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
}

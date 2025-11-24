export enum FinancialGoalStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

export interface BudgetRequest {
  category: string; // BUDGET_CATEGORY key
  amount: number;
  period: string; // REVENUE_PERIOD_TYPE key
  accountId: string;
}

export interface BudgetResponse {
  id: string;
  category: string;
  amount: number;
  period: string;
  accountId: string;
  spentAmount?: number; // Assuming backend might return this for progress tracking
  remainingAmount?: number;
}

export interface CreateGoalRequest {
  name: string;
  targetAmount: number;
  deadline: string; // YYYY-MM-DD
  autoDeductEnabled: boolean;
  autoDeductAmount?: number;
}

export interface GoalResponse {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyDeductionDay?: number;
  autoDeductEnabled: boolean;
  autoDeductAmount?: number;
  status: FinancialGoalStatus;
}

export interface AddFundsRequest {
  amount: number;
}

export enum RevenuePeriodType {
  YEARLY = 'YEARLY',
  HALF_YEARLY = 'HALF_YEARLY',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
}

export interface TotalRevenueData {
  periodLabel: string;
  revenue: number;
  periodType: RevenuePeriodType;
}
export interface UserGrowthData {
  month: string;
  newUsers: number;
}

export interface AdminKpiData {
  totalUsers: number;
  activeAccounts: number;
  totalTransactions: number;
  totalEarnings: number;
}
import { LOAN_TYPES } from '../../../../main/loan-management/models/loan.model';

export interface LoanInterestRateModel {
  id?: string;
  loanTypes: LOAN_TYPES;
  interestRate: number;
}

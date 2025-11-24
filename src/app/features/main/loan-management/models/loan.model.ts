export type LOAN_TYPES =
  | 'HOME'
  | 'PERSONAL'
  | 'VEHICLE'
  | 'STUDENT'
  | 'BUSINESS';
export type LOAN_STATUS =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'CLOSED'
  | 'DEFAULTED';
export type LOAN_UPDATE_TYPES =
  | 'Enhancement'
  | 'Tenure_Change'
  | 'Repayment_Method_Change'
  | 'Part_prepayment'
  | 'Restructuring';

export interface LoanModel {
  id: string;
  userId: string;
  loanNumber: string;
  loanType: LOAN_TYPES;
  principalAmount: number;
  interestRate: number;
  accountNumber?: string;
  totalMonths: number;
  emiAmount: number;
  loanStatus: LOAN_STATUS;
  applicationDate: string;
  totalAmountPaid: number;
  approvedDate?: string;
}

export interface LoanResponseModel {
  id: string;
  userId: string;
  loanNumber: string;
  loanType: LOAN_TYPES;
  principalAmount: number;
  interestRate: number;
  accountNumber: string;
  totalMonths: number;
  emiAmount: number;
  loanStatus: LOAN_STATUS;
  applicationDate: string;
  totalAmountPaid: number;
  approvedDate?: string;
}

export interface LoanRequestModel {
  userId: string;
  loanType: LOAN_TYPES;
  principalAmount: number;
  interestRate: number;
  totalMonths: number;
  accountNumber: string;
  description: string;
  updateType: LOAN_UPDATE_TYPES;
  prePaymentAmount?: number;
}

export interface LoanInterestRateModel {
  id: string;
  loanTypes: LOAN_TYPES;
  interestRate: number;
}

export interface ApplyLoanRequestModel {
  userId: string;
  loanType: LOAN_TYPES;
  principalAmount: number;
  interestRate: number;
  totalMonths: number;
  accountNumber: string;
}

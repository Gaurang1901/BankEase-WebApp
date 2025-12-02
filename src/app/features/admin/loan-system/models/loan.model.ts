export interface LoanModel {
  id: string;
  userId: string;
  loanNumber: string;
  accountNumber: string;
  loanType: LOANTYPES;
  principalAmount: number;
  interestRate: number;
  totalMonths: number;
  emiAmount: number;
  loanStatus: LOANSTATUS;
  applicationDate: Date;
  totalAmountPaid: number;
  approvedDate: Date;
}
export type LOANTYPES =
  | 'HOME'
  | 'PERSONAL'
  | 'VEHICLE'
  | 'STUDENT'
  | 'BUSINESS';

export type LOANSTATUS = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';

export interface EmiModel {
  id: string;
  loanNumber: string;
  accountNumber: string;
  accountId: string;
  emiNumber: number;
  emiAmount: number;
  emiDate: Date;
  principalAmount: number;
  interestAmount: number | null;
  totalAmount: number;
  paidDate: Date | null;
  paid: boolean;
}

export interface LoanDetailModel extends LoanModel {
  accountId: string;
  emis: EmiModel[];
}

export interface LoanDetailsModel {}

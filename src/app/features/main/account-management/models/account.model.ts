export interface Account {
  summary: AccountSummary;
  details: AccountDetails;
  holder: AccountHolder;
  linkedCards: LinkedCard[];
  activeLoans: ActiveLoan[];
}

export interface AccountSummary {
  accountType: string;
  accountName: string;
  availableBalance: number;
  accountNumber: string;
  accountHolder: string;
  status: 'active' | 'inactive' | 'closed';
  currency: string;
}

export interface AccountDetails {
  accountNumber: string;
  accountType: string;
  status: 'active' | 'inactive' | 'closed';
  openedOn: string; // ISO date string
  currency: string;
  branchCode: string;
}

export interface AccountHolder {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  dateOfBirth: string; // ISO date string
}

export interface LinkedCard {
  id: string;
  cardType: 'Visa' | 'Mastercard';
  category: 'Debit' | 'Credit';
  last4Digits: string;
  isPrimary: boolean;
}

export interface ActiveLoan {
  id: string;
  loanType: string;
  outstandingBalance: number;
  nextPaymentDate: string; // ISO date string
}

export interface DetailListItem {
  label: string;
  value: string;
  type?: 'text' | 'tag';
}

export interface CloseAccountPayload {
  reason: string;
  comments?: string;
}

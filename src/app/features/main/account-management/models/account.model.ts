export interface Account {
  summary: AccountSummary;
  details: AccountDetails;
  holder: AccountHolder;
  linkedCards: LinkedCard[];
  activeLoans: ActiveLoan[];
}

export interface AccountSummary {
  accountId: string;
  accountNumber: string;
  accountTypes: string;
  accountStatus: string;
  balance: number;
  createdAt: string;
  user: AccountHolder;
  cards: LinkedCard[];
  loans: ActiveLoan[];
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
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  address: AddressModel;
  userRole: string;
  dateOfBirth: string | Date;
  accounts: string[];
}

export interface AddressModel {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateId: string;
  stateName: string;
  pinCode: string;
  userId: string;
}

export interface LinkedCard {
  cardId: string;
  cardNumber: string;
  cardType: string;
  cardStatus: string;
}

export interface ActiveLoan {
  loanId: string;
  loanNumber: string;
  principalAmount: number;
  interestRate: number;
  totalMonths: number;
  emiAmount: number;
  totalAmountPaid: number;
  loanType: string;
  loanStatus: string;
  appliedDate: string;
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

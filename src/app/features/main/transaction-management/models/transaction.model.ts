export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export interface TransactionSummary {
  DEPOSIT: number;
  WITHDRAW: number;
  TRANSFER: number;
}

export interface BaseTransactionPayload {
  fromAccountNumber: string;
  toAccountNumber?: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  description: string;
  referenceNumber?: string;
  transactionChannel?: String;
  budgetCategory?: String;
}

export type TransactionPayload = BaseTransactionPayload;

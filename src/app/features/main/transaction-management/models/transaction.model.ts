export type TransactionType = 'Deposit' | 'Withdraw' | 'Transfer';

export interface TransactionSummary {
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
}

export interface BaseTransactionPayload {
  amount: number;
  description?: string;
}

export interface TransferPayload extends BaseTransactionPayload {
  recipientAccountNumber: string;
}

export type TransactionPayload = BaseTransactionPayload | TransferPayload;

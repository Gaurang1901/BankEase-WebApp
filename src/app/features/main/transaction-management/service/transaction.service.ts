import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  TransactionSummary,
  TransactionPayload,
  TransactionType,
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);

  /**
   * Fetches the summary of all transactions for a given account.
   * @param accountId The ID of the account.
   */
  getTransactionSummary(accountId: string): Observable<TransactionSummary> {
    // Replace with a real API call:
    // return this.http.get<TransactionSummary>(`/api/accounts/${accountId}/transaction-summary`);

    const mockSummary: TransactionSummary = {
      totalDeposits: 15000,
      totalWithdrawals: 6850,
      totalTransfers: 3000,
    };
    return of(mockSummary).pipe(delay(500));
  }

  /**
   * Executes a financial transaction (Deposit, Withdraw, or Transfer).
   * @param accountId The source account ID.
   * @param idempotencyKey A unique key (UUID) to prevent duplicate transactions.
   * @param transactionType The type of transaction.
   * @param payload The transaction data.
   */
  executeTransaction(
    accountId: string,
    idempotencyKey: string,
    transactionType: TransactionType,
    payload: TransactionPayload
  ): Observable<{ success: boolean }> {
    const headers = new HttpHeaders({
      'X-Idempotency-Key': idempotencyKey,
    });

    // The endpoint can be dynamic based on the transaction type
    const endpoint = `/api/accounts/${accountId}/${transactionType.toLowerCase()}`;

    console.log(`Executing ${transactionType} to endpoint: ${endpoint}`);
    console.log('Payload:', payload);
    console.log('Idempotency Key:', idempotencyKey);

    // Replace with a real API call:
    // return this.http.post<{ success: boolean }>(endpoint, payload, { headers });

    return of({ success: true }).pipe(delay(1500));
  }
}

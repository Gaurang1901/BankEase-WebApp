import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  TransactionSummary,
  TransactionPayload,
  TransactionType,
} from '../models/transaction.model';
import { ApiService } from '../../../../core/auth/services/api.service';
import { CommonResponseModel } from '../../../../core/types/helper.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(ApiService);

  /**
   * Fetches the summary of all transactions for a given account.
   * @param accountId The ID of the account.
   */
  getTransactionSummary(
    accountId: string
  ): Observable<CommonResponseModel<TransactionSummary>> {
    // Replace with a real API call:
    return this.http.get(`/api/users/transaction/summary/${accountId}`);

    // const mockSummary: TransactionSummary = {
    //   totalDeposits: 15000,
    //   totalWithdrawals: 6850,
    //   totalTransfers: 3000,
    // };
    // return of(mockSummary).pipe(delay(500));
  }
  executeTransaction(
    userId: string,
    idempotencyKey: string,
    payload: TransactionPayload
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Idempotency-Key': idempotencyKey,
    });

    const endpoint = `/api/users/transaction/${userId}`;

    return this.http.post(endpoint, payload, { headers });
  }
}

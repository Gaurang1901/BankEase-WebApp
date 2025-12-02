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

  getTransactionSummary(
    accountId: string
  ): Observable<CommonResponseModel<TransactionSummary>> {
    return this.http.get(`/api/users/transaction/summary/${accountId}`);
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

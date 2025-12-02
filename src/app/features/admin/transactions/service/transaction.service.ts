import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../core/auth/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  api = inject(ApiService);

  getAllTransactions(params: any): Observable<any> {
    return this.api.get('/api/users/transaction/all', { params });
  }

  verifyTransaction(transactionNumber: string): Observable<any> {
    return this.api.get(
      `/api/users/transaction/transactionNumber/${transactionNumber}`
    );
  }

  revertTransaction(
    transactionNumber: string,
    userId: string,
    reason: string
  ): Observable<any> {
    return this.api.post(
      `/api/users/transaction/revert/${transactionNumber}/${userId}`,
      { reason }
    );
  }
}

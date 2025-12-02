import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../core/auth/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  api = inject(ApiService);

  getAccounts(params: any): Observable<any> {
    return this.api.get('/admin/account/all', { params });
  }

  updateAccountStatus(
    accountNumber: string,
    status: string,
    reason: string
  ): Observable<any> {
    return this.api.put(
      `/api/account/update-status/${accountNumber}/${status}`,
      { reason }
    );
  }

  downloadStatement(payload: any): Observable<Blob> {
    // Using any cast to bypass the restrictive type definition in ApiService wrapper
    // to allow passing responseType: 'blob'
    return this.api.post('/api/statements/custom', payload, {
      responseType: 'blob',
    } as any);
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Account,
  AccountSummary,
  CloseAccountPayload,
} from '../models/account.model';
import { ApiService } from '../../../../core/auth/services/api.service';
import { CommonResponseModel } from '../../../../core/types/helper.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiService = inject(ApiService);
  getAccountOverview(
    accountId: string
  ): Observable<CommonResponseModel<AccountSummary>> {
    // Replace with a real API call:
    return this.apiService.get(`/api/users/account-summary/${accountId}`);

    // const mockAccountData: Account = {
    //   summary: {
    //     accountType: 'Primary Account',
    //     accountName: 'Savings Account',
    //     availableBalance: 25000.5,
    //     accountNumber: 'ACC000001',
    //     accountHolder: 'John Doe',
    //     status: 'active',
    //     currency: 'USD',
    //   },
    //   details: {
    //     accountNumber: 'ACC000001',
    //     accountType: 'Savings',
    //     status: 'active',
    //     openedOn: '2024-01-15T00:00:00Z',
    //     currency: 'USD ($)',
    //     branchCode: 'BNK001',
    //   },
    //   holder: {
    //     fullName: 'John Doe',
    //     email: 'john.doe@example.com',
    //     phone: '+1234567891',
    //     address: '456 Main Street',
    //     city: 'Los Angeles, CA',
    //     dateOfBirth: '1985-05-15T00:00:00Z',
    //   },
    //   // Example with data for UI design
    //   linkedCards: [
    //     {
    //       id: 'c1',
    //       cardType: 'Visa',
    //       category: 'Debit',
    //       last4Digits: '1234',
    //       isPrimary: true,
    //     },
    //     {
    //       id: 'c2',
    //       cardType: 'Mastercard',
    //       category: 'Credit',
    //       last4Digits: '5678',
    //       isPrimary: false,
    //     },
    //   ],
    //   // Start with no active loans to show the empty state
    //   activeLoans: [],
    // };

    // Simulate network delay
    // return of(mockAccountData).pipe(delay(500));
  }

  closeAccount(
    accountNumber: string,
    payload: CloseAccountPayload
  ): Observable<any> {
    // In a real application, this would be an HTTP POST request:
    return this.apiService.put(
      `/api/account/update-status/${accountNumber}/ACTIVE`,
      {}
    );

    // console.log(`Closing account ${accountId} with payload:`, payload);
    // // Simulate a successful API call
    // return of({ success: true }).pipe(delay(1000));
  }
}

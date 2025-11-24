import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LoanResponseModel,
  LoanRequestModel,
  LoanInterestRateModel,
  ApplyLoanRequestModel,
} from '../models/loan.model';
import { ApiService } from '../../../../core/auth/services/api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../../../core/types/helper.model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiService = inject(ApiService);

  getLoansByUserId(
    userId: string,
    paging: Paging
  ): Observable<CommonResponseModel<PagingMaster<LoanResponseModel>>> {
    let params = new HttpParams();
    (Object.keys(paging) as Array<keyof Paging>).forEach((key) => {
      if (paging[key] !== undefined) {
        params = params.append(key, String(paging[key]));
      }
    });
    return this.apiService.get(`/api/loans/user/${userId}`, { params });
  }

  updateLoan(
    loanId: string,
    payload: LoanRequestModel,
    userId: string
  ): Observable<CommonResponseModel<any>> {
    let params = new HttpParams().set('userId', userId);
    return this.apiService.put(`/api/loans/${loanId}`, payload, { params });
  }

  getLoanInterestRates(): Observable<
    CommonResponseModel<LoanInterestRateModel[]>
  > {
    return this.apiService.get('/api/loanInterest/');
  }

  applyForLoan(
    payload: ApplyLoanRequestModel,
    userId: string
  ): Observable<CommonResponseModel<any>> {
    let params = new HttpParams().set('userId', userId);
    return this.apiService.post('/api/loans/', payload, { params });
  }
}

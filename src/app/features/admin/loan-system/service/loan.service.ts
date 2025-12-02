import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/auth/services/api.service';
import {
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../../../core/types/helper.model';
import { LoanDetailModel, LoanModel } from '../models/loan.model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiService = inject(ApiService);

  constructor() {}

  getLoans(paging: Paging, status?: string) {
    console.log(paging);

    let params: HttpParams = new HttpParams();
    params = params.set('page', paging.page);
    params = params.set('size', 10);
    params = params.set('sortBy', paging.sortBy ?? 'createdDate');
    params = params.set('sortDirection', paging.sortDir ?? 'desc');
    if (status) {
      params = params.set('status', status);
      return this.apiService.get<CommonResponseModel<PagingMaster<LoanModel>>>(
        '/api/loans/filter',
        { params }
      );
    } else {
      return this.apiService.get<CommonResponseModel<PagingMaster<LoanModel>>>(
        '/api/loans/',
        { params }
      );
    }
  }

  getLoanDetails(id: string) {
    return this.apiService.get<CommonResponseModel<LoanDetailModel>>(
      `/api/loans/details/${id}`
    );
  }

  updateLoanStatus(id: string, status: string) {
    return this.apiService.put<void>(
      `/api/loans/${id}/status`,
      {},
      {
        params: new HttpParams().set('loanStatus', status),
      }
    );
  }
}

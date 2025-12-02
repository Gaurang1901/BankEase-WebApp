import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/auth/services/api.service';
import { StateModel } from '../state/models/state.model';
import { Paging } from '../../../../core/types/helper.model';
import { HttpParams } from '@angular/common/http';
import { LoanInterestRateModel } from '../loan-interest-rate/models/loan-interest-rate.model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiService = inject(ApiService);
  constructor() {}

  createState(stateData: StateModel) {
    return this.apiService.post('/api/state', stateData);
  }
  updateState(stateData: StateModel) {
    return this.apiService.put(`/api/state/${stateData.id}`, stateData);
  }
  deleteState(id: string) {
    return this.apiService.delete(`/api/state/${id}`);
  }

  getAllStates(data: any) {
    return this.apiService.get('/api/state', { params: data });
  }
  createLoanInterestRate(loanInterestRateData: LoanInterestRateModel) {
    return this.apiService.post('/api/loanInterest/', loanInterestRateData);
  }
  updateLoanInterestRate(loanInterestRateData: LoanInterestRateModel) {
    return this.apiService.put(
      `/api/loanInterest/${loanInterestRateData.id}`,
      loanInterestRateData
    );
  }
  deleteLoanInterestRate(id: string) {
    return this.apiService.delete(`/api/loanInterest/${id}`);
  }

  getAllLoanInterestRates(data: any) {
    return this.apiService.get('/api/loanInterest/', { params: data });
  }
}

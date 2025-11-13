import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  BalanceTrend,
  UserDashboardKpiResponse,
  UserRecenttTransactions,
  UsersMonthlyTransaction,
} from '../model/dashboard.types';
import { ApiService } from '../../../../core/auth/services/api.service';
import {
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../../../core/types/helper.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiService = inject(ApiService);


  getKPI(
    userId: string
  ): Observable<CommonResponseModel<UserDashboardKpiResponse>> {
    return this.apiService.get(`/api/user/dashboard/kpi/${userId}`);
  }

  getMonthlyTransactionsByUserId(
    userId: string,
    startDate: string,
    endDate: string
  ): Observable<CommonResponseModel<UsersMonthlyTransaction[]>> {
    let params = new HttpParams();
    params = params.append('accountId', userId);
    params = params.append('fromDate', startDate);
    params = params.append('toDate', endDate);
    return this.apiService.get(`/api/user/dashboard/monthly-transaction`, {
      params,
    });
  }

  getBalanceTrendByUserId(
    userId: string,
    year: number
  ): Observable<CommonResponseModel<BalanceTrend[]>> {
    let params = new HttpParams();
    params = params.append('accountId', userId);
    params = params.append('year', year);
    return this.apiService.get(`/api/user/dashboard/balance-trends`, { params });
  }

  getRecentTransactionsByUserId(
    accountId: string,
    fromDate: string,
    toDate: string,
    paging: Paging
  ): Observable<CommonResponseModel<PagingMaster<UserRecenttTransactions>>> {
    let params = new HttpParams();
    params = params.append('accountId', accountId);
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);
    for (const key in paging) {
      if (
        paging.hasOwnProperty(key) &&
        paging[key as keyof Paging] !== undefined
      ) {
        params = params.append(key, String(paging[key as keyof Paging]));
      }
    }
    return this.apiService.get(`/api/user/dashboard/recent-user-transactions`, {
      params,
    });
  }
}

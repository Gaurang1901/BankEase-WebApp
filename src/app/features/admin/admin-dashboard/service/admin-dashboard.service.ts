import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/auth/services/api.service';
import { map, Observable } from 'rxjs';
import { CommonResponseModel } from '../../../../core/types/helper.model';
import {
  AdminKpiData,
  RevenuePeriodType,
  TotalRevenueData,
  UserGrowthData,
} from '../model/admin-dahboard.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private http = inject(ApiService);
  private readonly API_BASE_URL = '/api/dashboard';

  /**
   * Fetches the Key Performance Indicators.
   */
  getKpi(): Observable<AdminKpiData> {
    return this.http
      .get(`${this.API_BASE_URL}/kpi`)
      .pipe(map((response: any) => response.data));
  }

  /**
   * Fetches user growth data for a given year.
   * @param year The year to fetch data for.
   */
  getUserGrowth(year: number): Observable<UserGrowthData[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http
      .get(`${this.API_BASE_URL}/user-growth`, {
        params,
      })
      .pipe(map((response: any) => response.data));
  }

  /**
   * Fetches total revenue data for a given period type.
   * @param type The revenue period type (e.g., YEARLY, MONTHLY).
   */
  getTotalRevenue(type: RevenuePeriodType): Observable<TotalRevenueData[]> {
    const params = new HttpParams().set('type', type);
    return this.http
      .get(`${this.API_BASE_URL}/total-revenue`, { params })
      .pipe(map((response: any) => response.data));
  }
}

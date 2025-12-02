import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../core/auth/services/api.service';
import {
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../../../core/types/helper.model';
import { CardModel } from '../model/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiService = inject(ApiService);

  constructor() {}

  getLoans(paging: Paging, status?: string) {
    console.log(paging);

    let params: HttpParams = new HttpParams();
    params = params.set('page', paging.page);
    params = params.set('size', 10);
    params = params.set('sortBy', paging.sortBy ?? 'createdAt');
    params = params.set('sortDirection', paging.sortDir ?? 'desc');
    if (status) {
      params = params.set('status', status);
      return this.apiService.get<CommonResponseModel<PagingMaster<CardModel>>>(
        '/api/admin/cards/pending',
        { params }
      );
    } else {
      return this.apiService.get<CommonResponseModel<PagingMaster<CardModel>>>(
        '/api/admin/cards',
        { params }
      );
    }
  }

  getCardTransactions(id: string) {
    return this.apiService.get<CommonResponseModel<any>>(
      `/api/cards/${id}/transactions`
    );
  }

  updateCardStatus(id: string, status: string, userId: string) {
    const headers = new HttpHeaders().set('X-User-ID', userId);
    return this.apiService.post<void>(
      `/api/admin/cards/${id}/${status}`,
      {},
      {
        headers,
      }
    );
  }
}

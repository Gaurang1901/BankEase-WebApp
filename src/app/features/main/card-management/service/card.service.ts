import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { CardModel, CardResponseModel } from '../models/card.model';
import { ApiService } from '../../../../core/auth/services/api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  CommonResponseModel,
  Paging,
} from '../../../../core/types/helper.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  apiService = inject(ApiService);

  private mockCards: CardModel[] = [
    {
      id: 'c1',
      type: 'DEBIT',
      cardNumber: '4532981273641234',
      expiry: '12/27',
      cvv: '123',
      holderName: 'John Doe',
      status: 'ACTIVE',
      themeColor: 'blue',
    },
    {
      id: 'c2',
      type: 'CREDIT',
      cardNumber: '5425111122225678',
      expiry: '06/28',
      cvv: '456',
      holderName: 'John Doe',
      status: 'ACTIVE',
      creditLimit: 100000,
      themeColor: 'orange',
    },
  ];

  getCards(
    accountId: string
  ): Observable<CommonResponseModel<CardResponseModel[]>> {
    // Simulating API latency
    // return of(this.mockCards).pipe(delay(500));
    return this.apiService.get(`/api/accounts/${accountId}/cards`);
  }

  blockCard(
    cardId: string,
    userId: string
  ): Observable<CommonResponseModel<any>> {
    const headers = new HttpHeaders().append('X-User-ID', userId);
    return this.apiService.post(`/api/cards/${cardId}/block`, {}, { headers });
  }

  requestCard(
    cardPayload: CardModel,
    accountId: string,
    userId: string
  ): Observable<CommonResponseModel<any>> {
    const headers = new HttpHeaders().append('X-User-ID', userId);
    return this.apiService.post(
      `/api/accounts/${accountId}/cards/request`,
      cardPayload,
      { headers: headers }
    );
  }

  getCardTransactions(
    data: Paging,
    cardId: string
  ): Observable<CommonResponseModel<any>> {
    let params = new HttpParams();
    (Object.keys(data) as Array<keyof Paging>).forEach((key) => {
      if (data[key] !== undefined) {
        params = params.append(key, String(data[key]));
      }
    });
    return this.apiService.get(`/api/cards/${cardId}/transactions`, { params });
  }
}

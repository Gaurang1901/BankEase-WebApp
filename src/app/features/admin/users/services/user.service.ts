import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../core/auth/services/api.service';
import { Observable } from 'rxjs';
import {
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../../../core/types/helper.model';
import { UserResponseModel } from '../models/user.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);
  private readonly API_BASE_URL = '/api/user';

  getUsers(
    paging: Paging
  ): Observable<CommonResponseModel<PagingMaster<UserResponseModel>>> {
    return this.apiService.get(`${this.API_BASE_URL}`, {
      params: this.createParams(paging),
    });
  }

  getAdminUsers(
    paging: Paging
  ): Observable<CommonResponseModel<PagingMaster<UserResponseModel>>> {
    return this.apiService.get(`${this.API_BASE_URL}/admin`, {
      params: this.createParams(paging),
    });
  }

  private createParams(paging: Paging): HttpParams {
    let params = new HttpParams()
      .set('page', paging.page.toString())
      .set('size', paging.size.toString());

    if (paging.sortBy) {
      params = params.set('sort', paging.sortBy);
    }

    return params;
  }
}

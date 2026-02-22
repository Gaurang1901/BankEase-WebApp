import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { CommonResponseModel } from '../../types/helper.model';

@Injectable({
  providedIn: 'root',
})
export class IdempotencyService {
  private apiService = inject(ApiService);

  /**
   * Fetches a new secure idempotency key from the backend.
   * Signed format: BE-[UUID]-[HMAC(UUID+userId)]
   */
  generateKey(): Observable<string> {
    return this.apiService
      .post<any>('/api/user/idempotency/generate', {})
      .pipe(map((response) => response.idempotencyKey));
  }
}

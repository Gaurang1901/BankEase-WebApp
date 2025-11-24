import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../../core/auth/services/api.service';
import {
  AddFundsRequest,
  BudgetRequest,
  BudgetResponse,
  CreateGoalRequest,
  GoalResponse,
} from '../models/budget.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiService = inject(ApiService);

  // Budget APIs
  createBudget(budget: BudgetRequest): Observable<BudgetResponse> {
    return this.apiService
      .post<any>('/api/user/budgets', budget)
      .pipe(map((res) => res.data));
  }

  updateBudget(id: string, budget: BudgetRequest): Observable<BudgetResponse> {
    return this.apiService
      .put<any>(`/api/user/budgets/${id}`, budget)
      .pipe(map((res) => res.data));
  }

  deleteBudget(id: string): Observable<void> {
    return this.apiService
      .delete<any>(`/api/user/budgets/${id}`)
      .pipe(map((res) => res.data));
  }

  getBudgetsByAccountId(accountId: string): Observable<BudgetResponse[]> {
    return this.apiService
      .get<any>(`/api/user/budgets/account/${accountId}`)
      .pipe(map((res) => res.data));
  }

  // Goal APIs
  createGoal(
    accountId: string,
    goal: CreateGoalRequest
  ): Observable<GoalResponse> {
    return this.apiService
      .post<any>(`/api/user/accounts/${accountId}/goals`, goal)
      .pipe(map((res) => res.data));
  }

  getGoals(accountId: string): Observable<GoalResponse[]> {
    return this.apiService
      .get<any>(`/api/user/accounts/${accountId}/goals`)
      .pipe(map((res) => res.data));
  }

  updateGoal(
    goalId: string,
    goal: CreateGoalRequest
  ): Observable<GoalResponse> {
    return this.apiService
      .put<any>(`/api/user/goals/${goalId}`, goal)
      .pipe(map((res) => res.data));
  }

  addFunds(
    goalId: string,
    request: AddFundsRequest,
    userId: string,
    idempotencyKey?: string
  ): Observable<GoalResponse> {
    let headers = new HttpHeaders().set('X-User-ID', userId);
    if (idempotencyKey) {
      headers = headers.set('Idempotency-Key', idempotencyKey);
    }
    return this.apiService
      .post<any>(`/api/user/goals/${goalId}/add-funds`, request, { headers })
      .pipe(map((res) => res.data));
  }

  deleteGoal(
    goalId: string,
    userId: string,
    idempotencyKey?: string
  ): Observable<void> {
    let headers = new HttpHeaders().set('X-User-ID', userId);
    if (idempotencyKey) {
      headers = headers.set('Idempotency-Key', idempotencyKey);
    }
    return this.apiService
      .delete<any>(`/api/user/goals/${goalId}`, undefined, {
        headers,
      })
      .pipe(map((res) => res.data));
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetSummaryComponent } from './components/budget-summary/budget-summary.component';
import { BudgetTrackingComponent } from './components/budget-tracking/budget-tracking.component';
import { FinancialGoalsComponent } from './components/financial-goals/financial-goals.component';
import { BudgetDialogComponent } from './components/budget-dialog/budget-dialog.component';
import { GoalDialogComponent } from './components/goal-dialog/goal-dialog.component';
import { AddFundsDialogComponent } from './components/add-funds-dialog/add-funds-dialog.component';
import { BudgetService } from './service/budget.service';
import {
  AddFundsRequest,
  BudgetRequest,
  BudgetResponse,
  CreateGoalRequest,
  GoalResponse,
} from './models/budget.model';
import { filter, switchMap, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/auth/services/auth.service';
import { IdempotencyService } from '../../../core/auth/services/idempotency.service';

@Component({
  selector: 'app-budget-system',
  standalone: true,
  imports: [
    CommonModule,
    BudgetSummaryComponent,
    BudgetTrackingComponent,
    FinancialGoalsComponent,
    BudgetDialogComponent,
    GoalDialogComponent,
    AddFundsDialogComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './budget-system.component.html',
  styles: [],
})
export class BudgetSystemComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private idempotencyService = inject(IdempotencyService);

  budgets: BudgetResponse[] = [];
  goals: GoalResponse[] = [];
  accountId: string | null = null;
  userId: string | null = null;

  // Dialog State
  budgetDialogVisible = false;
  selectedBudget: BudgetResponse | null = null;

  goalDialogVisible = false;
  selectedGoal: GoalResponse | null = null;

  addFundsDialogVisible = false;
  selectedGoalForFunds: GoalResponse | null = null;
  private idempotencyKey: string = '';

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (data) => {
        this.accountId = data.accountId ?? '';
        this.userId = data.userId ?? '';
        this.loadData();
      },
      error: (err) => this.showError('Failed to load user profile'),
    });
  }

  loadData() {
    if (!this.accountId) return;

    this.budgetService.getBudgetsByAccountId(this.accountId).subscribe({
      next: (data) => (this.budgets = data),
      error: (err) => this.showError('Failed to load budgets'),
    });

    this.budgetService.getGoals(this.accountId).subscribe({
      next: (data) => (this.goals = data),
      error: (err) => this.showError('Failed to load goals'),
    });
  }

  // Budget Actions
  openNewBudgetDialog() {
    this.selectedBudget = null;
    this.budgetDialogVisible = true;
  }

  onEditBudget(budget: BudgetResponse) {
    this.selectedBudget = budget;
    this.budgetDialogVisible = true;
  }

  onSaveBudget(budgetRequest: BudgetRequest) {
    if (!this.accountId) return;

    // Ensure accountId is set in request
    budgetRequest.accountId = this.accountId;

    if (this.selectedBudget) {
      this.budgetService
        .updateBudget(this.selectedBudget.id, budgetRequest)
        .subscribe({
          next: () => {
            this.showSuccess('Budget updated successfully');
            this.loadData();
          },
          error: () => this.showError('Failed to update budget'),
        });
    } else {
      this.budgetService.createBudget(budgetRequest).subscribe({
        next: () => {
          this.showSuccess('Budget created successfully');
          this.loadData();
        },
        error: () => this.showError('Failed to create budget'),
      });
    }
  }

  // Goal Actions
  openNewGoalDialog() {
    this.selectedGoal = null;
    this.goalDialogVisible = true;
  }

  onEditGoal(goal: GoalResponse) {
    this.selectedGoal = goal;
    this.goalDialogVisible = true;
  }

  onSaveGoal(goalRequest: CreateGoalRequest) {
    if (!this.accountId) return;

    if (this.selectedGoal) {
      this.budgetService
        .updateGoal(this.selectedGoal.id, goalRequest)
        .subscribe({
          next: () => {
            this.showSuccess('Goal updated successfully');
            this.loadData();
          },
          error: () => this.showError('Failed to update goal'),
        });
    } else {
      this.budgetService
        .createGoal(this.accountId, goalRequest, this.userId!)
        .subscribe({
          next: () => {
            this.showSuccess('Goal created successfully');
            this.loadData();
          },
          error: () => this.showError('Failed to create goal'),
        });
    }
  }

  // Add Funds Actions
  onAddFunds(goal: GoalResponse) {
    this.selectedGoalForFunds = goal;
    this.idempotencyService.generateKey().subscribe((key) => {
      this.idempotencyKey = key;
    });
    this.addFundsDialogVisible = true;
  }

  onSaveFunds(request: AddFundsRequest) {
    if (!this.selectedGoalForFunds || !this.userId) return;
    this.budgetService
      .addFunds(
        this.selectedGoalForFunds.id,
        request,
        this.userId,
        this.idempotencyKey,
      )
      .subscribe({
        next: () => {
          this.showSuccess('Funds added successfully');
          this.loadData();
        },
        error: () => this.showError('Failed to add funds'),
      });
  }

  private showSuccess(message: string) {
    this.messageService.add({
      key: 'custom-toast',
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  private showError(message: string) {
    this.messageService.add({
      key: 'custom-toast',
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}

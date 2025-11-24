import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { BudgetResponse } from '../../models/budget.model';
import { BUDGET_CATEGORY } from '../../../../../core/types/constants';

@Component({
  selector: 'app-budget-tracking',
  standalone: true,
  imports: [CommonModule, ProgressBarModule],
  templateUrl: './budget-tracking.component.html',
  styles: [],
})
export class BudgetTrackingComponent {
  @Input() budgets: BudgetResponse[] = [];
  @Output() editBudget = new EventEmitter<BudgetResponse>();

  getCategoryLabel(categoryKey: string): string {
    // Assuming BUDGET_CATEGORY is an object with keys matching the categoryKey
    // We need to cast it to any to access by index if it's not a simple map, or use Object.values/keys
    // Based on constants.ts, it's an object where keys are the enum values.
    const category = (BUDGET_CATEGORY as any)[categoryKey];
    return category ? category.label : categoryKey;
  }

  calculatePercentage(budget: BudgetResponse): number {
    if (!budget.amount || budget.amount === 0) return 0;
    const spent = budget.spentAmount || 0;
    return Math.min((spent / budget.amount) * 100, 100);
  }

  isOverBudget(budget: BudgetResponse): boolean {
    const spent = budget.spentAmount || 0;
    return spent > budget.amount;
  }
}

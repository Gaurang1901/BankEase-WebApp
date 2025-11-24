import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BudgetResponse } from '../../models/budget.model';

@Component({
  selector: 'app-budget-summary',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './budget-summary.component.html',
  styles: [],
})
export class BudgetSummaryComponent implements OnChanges {
  @Input() budgets: BudgetResponse[] = [];

  totalBudget = 0;
  totalSpent = 0;
  remaining = 0;
  spentPercentage = 0;
  remainingPercentage = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['budgets']) {
      this.calculateSummary();
    }
  }

  calculateSummary() {
    this.totalBudget = this.budgets.reduce((sum, b) => sum + b.amount, 0);
    // Assuming backend provides spentAmount, otherwise we'd need transaction data.
    // For now, I'll use the 'spentAmount' field I added to the interface.
    this.totalSpent = this.budgets.reduce(
      (sum, b) => sum + (b.spentAmount || 0),
      0
    );
    this.remaining = this.totalBudget - this.totalSpent;

    if (this.totalBudget > 0) {
      this.spentPercentage = (this.totalSpent / this.totalBudget) * 100;
      this.remainingPercentage = (this.remaining / this.totalBudget) * 100;
    } else {
      this.spentPercentage = 0;
      this.remainingPercentage = 0;
    }
  }
}

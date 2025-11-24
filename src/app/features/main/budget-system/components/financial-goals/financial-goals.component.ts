import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { GoalResponse } from '../../models/budget.model';

@Component({
  selector: 'app-financial-goals',
  standalone: true,
  imports: [CommonModule, ProgressBarModule],
  templateUrl: './financial-goals.component.html',
  styles: [],
})
export class FinancialGoalsComponent {
  @Input() goals: GoalResponse[] = [];
  @Output() editGoal = new EventEmitter<GoalResponse>();
  @Output() addFunds = new EventEmitter<GoalResponse>();

  calculatePercentage(goal: GoalResponse): number {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }

  getDaysLeft(deadline: string): number {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
}

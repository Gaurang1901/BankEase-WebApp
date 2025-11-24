import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanModel } from '../../models/loan.model';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-loan-item',
  imports: [CommonModule, TagModule, ButtonModule],
  templateUrl: './loan-item.component.html',
  styleUrl: './loan-item.component.css',
})
export class LoanItemComponent {
  loan = input.required<LoanModel>();
  onUpdate = output<LoanModel>();

  getStatusSeverity():
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    switch (this.loan().loanStatus) {
      case 'APPROVED':
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'REJECTED':
      case 'DEFAULTED':
        return 'danger';
      case 'CLOSED':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getStatusClass(): string {
    switch (this.loan().loanStatus) {
      case 'APPROVED':
      case 'ACTIVE':
        return '!bg-blue-500/20 !text-blue-400';
      case 'PENDING':
        return '!bg-orange-500/20 !text-orange-400';
      case 'REJECTED':
      case 'DEFAULTED':
        return '!bg-red-500/20 !text-red-400';
      case 'CLOSED':
        return '!bg-gray-500/20 !text-gray-400';
      default:
        return '!bg-blue-500/20 !text-blue-400';
    }
  }

  isUpdateDisabled(): boolean {
    return (
      this.loan().loanStatus !== 'APPROVED' &&
      this.loan().loanStatus !== 'ACTIVE'
    );
  }

  handleUpdate(): void {
    if (!this.isUpdateDisabled()) {
      this.onUpdate.emit(this.loan());
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}

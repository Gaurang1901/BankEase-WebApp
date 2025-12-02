import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../../components/table/table.component';
import { Column, Paging } from '../../../../../core/types/helper.model';
import { LoanService } from '../../service/loan.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LoanModel } from '../../models/loan.model';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-approval-loans',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './pending-approval-loans.component.html',
  styleUrl: './pending-approval-loans.component.css',
  providers: [DatePipe, CurrencyPipe, DialogService, MessageService],
})
export class PendingApprovalLoansComponent {
  loanService = inject(LoanService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  datePipe = inject(DatePipe);
  currencyPipe = inject(CurrencyPipe);
  router = inject(Router);

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  columns: Column[] = [
    { field: 'loanNumber', header: 'Loan Number' },
    { field: 'loanType', header: 'Loan Type' },
    { field: 'totalMonths', header: 'Total Tenure (Months)' },
    { field: 'accountNumber', header: 'Account Number' },
    {
      field: 'emiAmount',
      header: 'EMI Amount',
      cellRenderer: (row: LoanModel) =>
        this.currencyPipe.transform(row.emiAmount, 'INR'),
    },
    {
      field: 'totalAmountPaid',
      header: 'Total Amount Paid',
      cellRenderer: (row: LoanModel) =>
        this.currencyPipe.transform(row.totalAmountPaid, 'INR'),
    },
    {
      field: 'applicationDate',
      header: 'Application Date',
      cellRenderer: (row: LoanModel) =>
        this.datePipe.transform(row.applicationDate, 'mediumDate'),
    },
    {
      field: 'interestRate',
      header: 'Interest Rate (%)',
      cellRenderer: (row: LoanModel) => `${row.interestRate}%`,
    },
  ];

  getPendingLoans = (paging: Paging) =>
    this.loanService.getLoans(paging, 'PENDING');

  handleAction(row: LoanModel, action: string) {
    if (action === 'APPROVE') {
      this.updateStatus(row.id, 'APPROVED');
    } else if (action === 'REJECT') {
      this.updateStatus(row.id, 'REJECTED');
    } else if (action === 'VIEW') {
      this.openDetails(row);
    }
  }

  ngAfterViewInit() {
    this.columns.push({
      field: 'actions',
      header: 'Actions',
      cellTemplate: this.actionTemplate,
    });
  }

  updateStatus(id: string, status: string) {
    this.loanService.updateLoanStatus(id, status).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Loan ${status.toLowerCase()} successfully`,
        });
        // Trigger table refresh if possible, or just let user reload.
        // Ideally TableComponent should have a refresh mechanism exposed.
        // For now, we rely on the user or implement a refresh subject.
        window.location.reload(); // Simple refresh for now
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update loan status',
        });
      },
    });
  }

  openDetails(loan: LoanModel) {
    this.router.navigate(['/admin/loans/details', loan.id]);
  }
}

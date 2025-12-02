import { Component, inject } from '@angular/core';
import { TableComponent } from '../../../../../components/table/table.component';
import { Column, Paging } from '../../../../../core/types/helper.model';
import { LoanService } from '../../service/loan.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LoanModel } from '../../models/loan.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.css',
  providers: [DatePipe, CurrencyPipe, DialogService],
})
export class LoanListComponent {
  loanService = inject(LoanService);
  dialogService = inject(DialogService);
  datePipe = inject(DatePipe);
  currencyPipe = inject(CurrencyPipe);
  router = inject(Router);

  paging: Paging = {
    page: 0,
    size: 10,
    sortBy: 'createdDate',
    sortDir: 'desc',
  };

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
    {
      field: 'actions',
      header: 'Actions',
      cellRenderer: () =>
        `<i class="pi pi-eye text-blue-500 cursor-pointer"></i>`,
      onClick: (row: LoanModel) => this.openDetails(row),
    },
  ];

  getLoans = (paging: Paging) => this.loanService.getLoans(paging);

  openDetails(loan: LoanModel) {
    this.router.navigate(['/admin/loans/details', loan.id]);
  }
}

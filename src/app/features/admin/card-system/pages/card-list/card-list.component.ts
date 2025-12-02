import { Component, inject } from '@angular/core';
import { TableComponent } from '../../../../../components/table/table.component';
import { Column, Paging } from '../../../../../core/types/helper.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { CardService } from '../../service/card.service';
import { CardModel } from '../../model/card.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css',
  providers: [DatePipe, CurrencyPipe, DialogService],
})
export class CardListComponent {
  loanService = inject(CardService);
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
    { field: 'maskedCardNumber', header: 'Card Number' },
    { field: 'cardType', header: 'Card Type' },
    { field: 'status', header: 'Status' },
    { field: 'accountNumber', header: 'Account Number' },
    {
      field: 'cardHolderName',
      header: 'Card Holder Name',
    },
    {
      field: 'expiryDate',
      header: 'Expiry Date',
      cellRenderer: (row: CardModel) =>
        this.datePipe.transform(row.expiryDate, 'mediumDate'),
    },
    {
      field: 'actions',
      header: 'Actions',
      cellRenderer: () =>
        `<i class="pi pi-eye text-blue-500 cursor-pointer"></i>`,
      onClick: (row: CardModel) => this.openDetails(row),
    },
  ];

  getLoans = (paging: Paging) => this.loanService.getLoans(paging);

  openDetails(loan: CardModel) {
    this.router.navigate(['/admin/card/', loan.id]);
  }
}

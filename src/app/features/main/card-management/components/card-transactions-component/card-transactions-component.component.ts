import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { TableComponent } from '../../../../../components/table/table.component';
import {
  Column,
  CommonResponseModel,
  Paging,
} from '../../../../../core/types/helper.model';
import { Observable } from 'rxjs';
import { CardService } from '../../service/card.service';

@Component({
  selector: 'app-card-transactions-component',
  imports: [Dialog, TableComponent],
  templateUrl: './card-transactions-component.component.html',
  styleUrl: './card-transactions-component.component.css',
})
export class CardTransactionsComponentComponent {
  @Input() cardId: string = '168c77a5-c2c8-45df-9ba6-3fdeea176f41';
  @Output() close = new EventEmitter<boolean>();
  @Input() visible: boolean = true;

  cardService = inject(CardService);

  columns: Column[] = [
    {
      field: 'date',
      header: 'Date',
      cellRenderer: (data) => {
        if (data.date) {
          return new Date(data.date).toLocaleDateString();
        } else {
          return 'N/A';
        }
      },
    },
    { field: 'description', header: 'Description' },
    {
      field: 'amount',
      header: 'Amount',
      cellRenderer: (data) => {
        if (data.amount) {
          return data.amount;
        } else {
          return 'N/A';
        }
      },
    },
    {
      field: 'balance',
      header: 'Balance',
      cellRenderer: (data) => {
        if (data.balance) {
          return data.balance;
        } else {
          return 'N/A';
        }
      },
    },
  ];

  paging: Paging = {
    page: 0,
    size: 10,
  };

  onClose() {
    this.close.emit(false);
  }

  getCardTransactions(
    data: Paging,
    componentInstace: CardTransactionsComponentComponent
  ): Observable<CommonResponseModel<any>> {
    return componentInstace.cardService.getCardTransactions(
      data,
      componentInstace.cardId
    );
  }
}

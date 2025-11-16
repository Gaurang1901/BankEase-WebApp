import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import { TableComponent } from '../../../../../components/table/table.component';
import { ApiService } from '../../../../../core/auth/services/api.service';
import { CustomTableService } from '../../../../../core/services/table.service';
import {
  Column,
  Paging,
  CommonResponseModel,
  PagingMaster,
} from '../../../../../core/types/helper.model';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css'],
})
export class TransactionTableComponent implements OnInit, AfterViewInit {
  @ViewChild('transactionTypeFilter', { static: true })
  transactionTypeFilter!: TemplateRef<any>;

  columns: Column[] = [];
  totalItems = 0;
  paginationPageSize = 10;
  exportUrl = '/transactions/export';

  selectedTransactionType: string = 'ALL';

  // use functional inject to match patterns in project
  api: ApiService = inject(ApiService);
  private _tableService: CustomTableService = inject(CustomTableService);

  ngOnInit(): void {
    // initial column setup without the custom filter template assigned yet
    this.columns = [
      {
        header: 'Transaction Type',
        field: 'transactionType',
        cellRenderer: (row: any) => row.transactionType ?? '-',
      },
      {
        header: 'Transaction Amount',
        field: 'amount',
        cellRenderer: (row: any) =>
          row.amount != null
            ? Number(row.amount).toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
              })
            : '-',
      },
      {
        header: 'Transaction Status',
        field: 'status',
        cellRenderer: (row: any) => row.status ?? '-',
      },
      {
        header: 'Description',
        field: 'description',
        cellRenderer: (row: any) => row.description ?? '-',
      },
      {
        header: 'Remaining Balance',
        field: 'remainingBalance',
        cellRenderer: (row: any) =>
          row.remainingBalance != null
            ? Number(row.remainingBalance).toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
              })
            : '-',
      },
    ];
  }

  ngAfterViewInit(): void {
    const txTypeCol = this.columns.find((c) => c.field === 'transactionType');
    if (txTypeCol) {
      txTypeCol.customFilterTemplate = this.transactionTypeFilter;
    }
  }

  // getDataFunc - matches the signature expected by the reusable table component
  getData = (
    paging: Paging,
    componentInstance?: any
  ): Observable<CommonResponseModel<PagingMaster<any>>> => {
    const params: any = {
      page: paging.page ?? 0,
      size: paging.size ?? this.paginationPageSize,
    };

    if (
      this.selectedTransactionType &&
      this.selectedTransactionType !== 'ALL'
    ) {
      params.transactionType = this.selectedTransactionType;
    }

    // ApiService.get is expected to return the correct typed Observable
    return this.api.get('/transactions', { params } as any);
  };

  onFilterChange(value: string) {
    this.selectedTransactionType = value;
    // expose filter string (optional) and trigger table refresh
    this._tableService.setfilterString(value);
    this._tableService.setrefreshTable(true);
  }
}

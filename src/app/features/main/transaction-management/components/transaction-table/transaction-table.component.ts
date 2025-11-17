import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { TableComponent } from '../../../../../components/table/table.component';
import { ApiService } from '../../../../../core/auth/services/api.service';
import { CustomTableService } from '../../../../../core/services/table.service';
import {
  Column,
  Paging,
  CommonResponseModel,
  PagingMaster,
} from '../../../../../core/types/helper.model';
import { AuthService } from '../../../../../core/auth/services/auth.service';

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
  accountId!: string;

  // use functional inject to match patterns in project
  api: ApiService = inject(ApiService);
  authService: AuthService = inject(AuthService);
  private _tableService: CustomTableService = inject(CustomTableService);

  ngOnInit(): void {
    // initial column setup without the custom filter template assigned yet
    this.columns = [
      {
        header: 'Transaction Date',
        field: 'transactionDate',
        cellRenderer: (row: any) =>
          new Date(row.transactionDate).toDateString() ?? '-',
      },
      {
        header: 'Transaction Number',
        field: 'transactionNumber',
        cellRenderer: (row: any) => row.transactionNumber ?? '-',
      },
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
                currency: 'INR',
              })
            : '-',
      },
      {
        header: 'Transaction Status',
        field: 'transactionStatus',
        cellRenderer: (row: any) => row.transactionStatus ?? '-',
      },
      {
        header: 'Description',
        field: 'description',
        cellRenderer: (row: any) => row.description ?? '-',
      },
      {
        header: 'Remaining Balance',
        field: 'balanceAfter',
        cellRenderer: (row: any) =>
          row.balanceAfter != null
            ? Number(row.balanceAfter).toLocaleString(undefined, {
                style: 'currency',
                currency: 'INR',
              })
            : '-',
      },
    ];

    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.accountId = user.accountId!;
        this._tableService.setrefreshTable(true);
      }
    });
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
    componentInstance?: TransactionTableComponent
  ): Observable<CommonResponseModel<PagingMaster<any>>> => {
    if (componentInstance?.accountId) {
      const params: any = {
        page: paging.page ?? 0,
        size: 10,
        sortBy: paging.sortBy ?? 'createdAt',
        sortDir: paging.sortDir ?? 'desc',
      };

      if (
        componentInstance.selectedTransactionType &&
        componentInstance.selectedTransactionType !== 'ALL'
      ) {
        params.transactionType = componentInstance.selectedTransactionType;
      }

      return componentInstance.api.get(
        `/api/users/transaction/account/${componentInstance.accountId}`,
        {
          params,
        } as any
      );
    } else {
      return of({} as any);
    }
  };

  onFilterChange(value: string) {
    this.selectedTransactionType = value;
    // expose filter string (optional) and trigger table refresh
    this._tableService.setfilterString(value);
    this._tableService.setrefreshTable(true);
  }
}

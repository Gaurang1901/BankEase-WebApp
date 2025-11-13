import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableComponent } from '../../../../../components/table/table.component';
import {
  Column,
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../../../../core/types/helper.model';
import { Observable, tap } from 'rxjs';
import { DashboardService } from '../../service/dashboard.service';
import { UserRecenttTransactions } from '../../model/dashboard.types';
import { User } from '../../../../../core/auth/store/auth.state';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { CustomTableService } from '../../../../../core/services/table.service';

@Component({
  selector: 'app-recent-transaction-table',
  imports: [CardModule, TableComponent],
  templateUrl: './recent-transaction-table.component.html',
  styleUrl: './recent-transaction-table.component.css',
})
export class RecentTransactionTableComponent {
  columns: Column[] = [];
  user: User | null = null;
  paging: Paging = {
    page: 0,
    size: 10,
  };

  dashboardService = inject(DashboardService);
  constructor(
    private authService: AuthService,
    private tableService: CustomTableService
  ) {
    this.authService.getUserProfile().subscribe((user) => {
      this.user = user;
      this.tableService.setrefreshTable(true);
    });
  }

  ngOnInit() {
    this.columns = [
      {
        field: 'transactionDate',
        header: 'Date',
        cellRenderer: (data: any) => {
          if (!data.transactionDate) {
            return '';
          }
          const date = new Date(data.transactionDate);
          return date.toLocaleDateString();
        },
      },
      { field: 'description', header: 'Description' },
      { field: 'amount', header: 'Amount' },
      { field: 'type', header: 'Type' },
      { field: 'status', header: 'Status' },
    ];
  }

  getRecentTransactions(
    data: Paging,
    componentInstance: RecentTransactionTableComponent
  ): Observable<CommonResponseModel<PagingMaster<UserRecenttTransactions>>> {
    return componentInstance.dashboardService
      .getRecentTransactionsByUserId(
        componentInstance.user?.accountId ?? '',
        new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
        new Date().toISOString(),
        data
      )
      .pipe(tap((response) => {}));
  }
}

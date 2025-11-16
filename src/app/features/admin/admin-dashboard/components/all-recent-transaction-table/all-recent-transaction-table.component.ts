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
import { User } from '../../../../../core/auth/store/auth.state';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { CustomTableService } from '../../../../../core/services/table.service';
import { RecentTransactionTableComponent } from '../../../../main/user-dashboard/components/recent-transaction-table/recent-transaction-table.component';
import { UserRecenttTransactions } from '../../../../main/user-dashboard/model/dashboard.types';
import { DashboardService } from '../../../../main/user-dashboard/service/dashboard.service';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { AdminDashboardService } from '../../service/admin-dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-recent-transaction-table',
  imports: [
    CardModule,
    TableComponent,
    DatePickerModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './all-recent-transaction-table.component.html',
  styleUrl: './all-recent-transaction-table.component.css',
})
export class AllRecentTransactionTableComponent {
  columns: Column[] = [];
  selectedMonth: any = new Date();
  user: User | null = null;
  paging: Paging = {
    page: 0,
    size: 10,
  };
  datePipe = new DatePipe('en-US');

  months: string[] = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  dashboardService = inject(AdminDashboardService);
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
        field: 'createdAt',
        header: 'Date',
        cellRenderer: (data: any) => {
          if (!data.transactionDate) {
            return '';
          }
          const date = new Date(data.transactionDate);
          return date.toLocaleDateString();
        },
      },
      { field: 'accountNumber', header: 'Account Number' },
      { field: 'actionType', header: 'Type' },
      { field: 'amount', header: 'Amount' },
      { field: 'description', header: 'Description' },
      { field: 'status', header: 'Status' },
    ];
  }

  getRecentTransactions(
    data: Paging,
    componentInstance: AllRecentTransactionTableComponent
  ): Observable<CommonResponseModel<PagingMaster<UserRecenttTransactions>>> {
    const monthStr = componentInstance.datePipe.transform(
      new Date(componentInstance.selectedMonth),
      'yyyy-MM'
    );
    return componentInstance.dashboardService
      .getRecentTransactionsBymonth(monthStr || '')
      .pipe(tap((response) => {}));
  }
}

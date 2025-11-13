import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { KpiCardComponent } from '../../../components/kpi-card/kpi-card.component';
import { MonthlyTransactionsComponent } from './components/monthly-transactions/monthly-transactions.component';
import { BalanceTrendGraphComponent } from './components/balance-trend-graph/balance-trend-graph.component';
import { DashboardService } from './service/dashboard.service';
import { KpiCard } from './model/dashboard.types';
import { RecentTransactionTableComponent } from './components/recent-transaction-table/recent-transaction-table.component';
import { PageHeaderService } from '../../../core/services/page-header.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { User } from '../../../core/auth/store/auth.state';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    KpiCardComponent,
    MonthlyTransactionsComponent,
    BalanceTrendGraphComponent,
    RecentTransactionTableComponent,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  kpiCards: KpiCard[] = [];
  user: User | null = null;

  constructor(
    private dashboardService: DashboardService,
    private pageHeaderService: PageHeaderService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.authService.getUserProfile().subscribe((user) => {
      this.user = user;
      this.getKPIData(user.userId!);
    });
  }

  ngOnInit(): void {
    // this.getKPIData();
    this.setPageHeader();
  }

  setPageHeader(): void {
    this.pageHeaderService.setTitle(`Welcome ${this.user?.name || 'User'}`);
  }
  getKPIData(userId: string): void {
    this.dashboardService.getKPI(userId).subscribe({
      next: (response) => {
        this.kpiCards = [
          {
            title: 'Total Accounts',
            value: response.data.totalAccounts,
            icon: 'pi-wallet',
            colorClass: 'bg-blue-500',
          },
          {
            title: 'Total Cards',
            value: response.data.totalCards,
            icon: 'pi-credit-card',
            colorClass: 'bg-orange-500',
          },
          {
            title: 'Financial Goals',
            value: response.data.totalFinancialGoals,
            icon: 'pi-flag',
            colorClass: 'bg-teal-500',
          },
          {
            title: 'Total Transactions',
            value: response.data.totalTransactions,
            icon: 'pi-chart-line',
            colorClass: 'bg-purple-500',
          },
        ];
      },
      error: (err) => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch KPI data. Please try again.',
        });
      },
    });
  }
}

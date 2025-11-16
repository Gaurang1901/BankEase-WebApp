import { Component, inject } from '@angular/core';
import { AdminDashboardService } from './service/admin-dashboard.service';
import { CommonModule } from '@angular/common';
import { KpiCard } from '../../main/user-dashboard/model/dashboard.types';
import { KpiCardComponent } from '../../../components/kpi-card/kpi-card.component';
import { UsersAddedOverTimeComponent } from './components/users-added-over-time/users-added-over-time.component';
import { TotalRevenueGraphComponent } from './components/total-revenue-graph/total-revenue-graph.component';
import { AllRecentTransactionTableComponent } from './components/all-recent-transaction-table/all-recent-transaction-table.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    KpiCardComponent,
    UsersAddedOverTimeComponent,
    TotalRevenueGraphComponent,
    CommonModule,
    AllRecentTransactionTableComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  kpiCards: KpiCard[] = [];
  private dashboardService = inject(AdminDashboardService);

  ngOnInit(): void {
    this.dashboardService.getKpi().subscribe((response) => {
      this.kpiCards = [
        {
          title: 'Registered Users',
          value: response.totalUsers,
          icon: 'pi-user',
          colorClass: 'bg-blue-600',
        },
        {
          title: 'Active Accounts',
          value: response.activeAccounts,
          icon: 'pi-wallet',
          colorClass: 'bg-green-600',
        },
        {
          title: 'Processed Transactions',
          value: response.totalTransactions,
          icon: 'pi-sync',
          colorClass: 'bg-purple-600',
        },
        {
          title: 'Total Revenue',
          // keep a numeric value to match KpiCard.value: number
          value: response.totalEarnings ?? 0,
          icon: 'pi-dollar',
          colorClass: 'bg-yellow-600',
        },
      ];
    });
  }
}

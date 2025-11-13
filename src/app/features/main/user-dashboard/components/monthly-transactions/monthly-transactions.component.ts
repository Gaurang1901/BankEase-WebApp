import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UsersMonthlyTransaction } from '../../model/dashboard.types';
import { DashboardService } from '../../service/dashboard.service';
import { ReusableGraphComponent } from '../../../../../components/reusable-graph/reusable-graph.component';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-monthly-transactions',
  imports: [ReusableGraphComponent, CardModule],
  templateUrl: './monthly-transactions.component.html',
  styleUrl: './monthly-transactions.component.css',
})
export class MonthlyTransactionsComponent {
  transactionData: UsersMonthlyTransaction[] = [];
  // initialize with an empty option so the reusable chart has a value on init
  chartOption: EChartsOption = {};
  private destroy$ = new Subject<void>();
  private cd = inject(ChangeDetectorRef);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {
    this.authService
      .getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.getMonthlyTransactions(user.accountId!);
      });
  }

  ngOnInit(): void {}

  getMonthlyTransactions(userId: string): void {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();
    this.dashboardService
      .getMonthlyTransactionsByUserId(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
      )
      .subscribe({
        next: (response) => {
          // backend may return either { data: [...] } or { data: { content: [...] } }
          const payload = (response as any).data;
          const list: UsersMonthlyTransaction[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.content)
            ? payload.content
            : [];

          this.transactionData = list;

          // Only set chartOption if we have data
          if (this.transactionData && this.transactionData.length) {
            this.chartOption = this.createChartOptions(this.transactionData);
            // ensure change detection so the reusable graph picks up the new option
            try {
              this.cd.detectChanges();
            } catch (e) {
              // ignore - detectChanges may throw if called too early
            }
          }
        },
      });
  }

  private createChartOptions(data: UsersMonthlyTransaction[]): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: [
        {
          type: 'category',
          data: data.map((item) => item.month),
          axisTick: { alignWithLabel: true },
        },
      ],
      yAxis: [{ type: 'value' }],
      series: [
        {
          name: 'Transactions',
          type: 'bar',
          barWidth: '60%',
          data: data.map((item) => item.totalTransactions),
          itemStyle: {
            color: '#3b82f6', // blue-500
          },
        },
      ],
      responsive: true,
    };
  }
}

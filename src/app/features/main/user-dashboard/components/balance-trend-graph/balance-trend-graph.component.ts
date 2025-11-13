import { ChangeDetectorRef, Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BalanceTrend } from '../../model/dashboard.types';
import { DashboardService } from '../../service/dashboard.service';
import { ReusableGraphComponent } from '../../../../../components/reusable-graph/reusable-graph.component';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-balance-trend-graph',
  imports: [ReusableGraphComponent, CardModule],
  templateUrl: './balance-trend-graph.component.html',
  styleUrl: './balance-trend-graph.component.css',
})
export class BalanceTrendGraphComponent {
  // initialize to empty so reusable graph has a defined input on init
  chartOption: EChartsOption = {};
  chartData: BalanceTrend[] = [];
  private destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    this.authService
      .getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.getBalanceTrendData(user.accountId!);
      });
  }

  getBalanceTrendData(accountId: string): void {
    const startDate = new Date().getFullYear();
    this.dashboardService
      .getBalanceTrendByUserId(accountId, startDate)
      .subscribe({
        next: (response) => {
          const payload = (response as any).data;
          const list: BalanceTrend[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.content)
            ? payload.content
            : [];

          this.chartData = list;

          if (this.chartData && this.chartData.length) {
            this.chartOption = this.createChartOptions(this.chartData);
            try {
              this.cd.detectChanges();
            } catch (e) {
              console.error('Error during change detection:', e);
            }
          }
        },
      });
  }

  ngOnInit(): void {}

  private createChartOptions(data: BalanceTrend[]): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map((item) => item.month),
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Average Balance',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.averageBalance),
          itemStyle: {
            color: '#10b981', // emerald-500
          },
          areaStyle: {
            color: '#a7f3d0', // emerald-200
          },
        },
      ],
      responsive: true,
    };
  }
}

import { Component, inject } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DashboardService } from '../../../../main/user-dashboard/service/dashboard.service';
import {
  RevenuePeriodType,
  TotalRevenueData,
} from '../../model/admin-dahboard.model';
import { AdminDashboardService } from '../../service/admin-dashboard.service';
import { ReusableGraphComponent } from '../../../../../components/reusable-graph/reusable-graph.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-revenue-graph',
  imports: [ReusableGraphComponent, CommonModule],
  templateUrl: './total-revenue-graph.component.html',
  styleUrl: './total-revenue-graph.component.css',
})
export class TotalRevenueGraphComponent {
  chartOptions?: EChartsOption;
  private dashboardService = inject(AdminDashboardService);

  ngOnInit(): void {
    this.dashboardService
      .getTotalRevenue(RevenuePeriodType.YEARLY)
      .subscribe((data) => {
        this.chartOptions = this.createChartOptions(data);
      });
  }

  private createChartOptions(data: TotalRevenueData[]): EChartsOption {
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.periodLabel),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#9CA3AF',
          formatter: '${value}',
        },
        splitLine: { lineStyle: { color: '#4B5563' } },
      },
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          barWidth: '60%',
          data: data.map((item) => item.revenue),
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      backgroundColor: 'transparent',
    };
  }
}

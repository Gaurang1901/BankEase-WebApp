import { Component, inject } from '@angular/core';
import { EChartsOption } from 'echarts';
import { UserGrowthData } from '../../model/admin-dahboard.model';
import { AdminDashboardService } from '../../service/admin-dashboard.service';
import { ReusableGraphComponent } from '../../../../../components/reusable-graph/reusable-graph.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-added-over-time',
  imports: [ReusableGraphComponent, CommonModule],
  templateUrl: './users-added-over-time.component.html',
  styleUrl: './users-added-over-time.component.css',
})
export class UsersAddedOverTimeComponent {
  chartOptions?: EChartsOption;
  private dashboardService = inject(AdminDashboardService);

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.dashboardService.getUserGrowth(currentYear).subscribe((data) => {
      this.chartOptions = this.createChartOptions(data);
    });
  }

  private createChartOptions(data: UserGrowthData[]): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.month),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'New Users',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          data: data.map((item) => item.newUsers),
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

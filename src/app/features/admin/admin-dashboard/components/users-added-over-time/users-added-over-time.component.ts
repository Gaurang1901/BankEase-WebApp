import { Component, inject } from '@angular/core';
import { EChartsOption } from 'echarts';
import { UserGrowthData } from '../../model/admin-dahboard.model';
import { AdminDashboardService } from '../../service/admin-dashboard.service';
import { ReusableGraphComponent } from '../../../../../components/reusable-graph/reusable-graph.component';
import { CommonModule } from '@angular/common';

import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-added-over-time',
  imports: [ReusableGraphComponent, CommonModule, DatePickerModule, FormsModule],
  templateUrl: './users-added-over-time.component.html',
  styleUrl: './users-added-over-time.component.css',
})
export class UsersAddedOverTimeComponent {
  chartOptions?: EChartsOption;
  selectedYear: Date = new Date(2025, 0, 1);
  private dashboardService = inject(AdminDashboardService);

  ngOnInit(): void {
    this.loadData(this.selectedYear.getFullYear());
  }

  onYearChange(): void {
    if (this.selectedYear) {
      this.loadData(this.selectedYear.getFullYear());
    }
  }

  private loadData(year: number): void {
    this.dashboardService.getUserGrowth(year).subscribe((data) => {
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

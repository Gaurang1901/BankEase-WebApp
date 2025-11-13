import {
  Component,
  ElementRef,
  Input,
  NgZone,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import * as echarts from 'echarts';

@Component({
  selector: 'app-reusable-graph',
  imports: [],
  templateUrl: './reusable-graph.component.html',
  styleUrl: './reusable-graph.component.css',
})
export class ReusableGraphComponent {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input({ required: true }) chartOption!: echarts.EChartsOption;
  windowWidth: number = window.innerWidth;

  private echartsInstance: echarts.ECharts | null = null;
  private resizeSubscription?: Subscription;
  private resizeObserver!: ResizeObserver;
  private originalSpacerData: number[] = [];
  @Input() chartHeight: string = '40vh';

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initChart();
    this.handleResize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['chartOption']?.previousValue !==
      changes['chartOption']?.currentValue
    ) {
      this.echartsInstance?.clear();
      this.chartOption = changes['chartOption'].currentValue;
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
    this.resizeObserver?.disconnect();
    this.echartsInstance?.dispose();
  }

  private initChart(): void {
    if (this.chartContainer) {
      // Dispose existing instance before creating a new one to avoid double-init issues
      if (this.echartsInstance) {
        try {
          this.echartsInstance.dispose();
        } catch (e) {
          // ignore dispose errors
        }
        this.echartsInstance = null;
      }

      this.echartsInstance = echarts.init(
        this.chartContainer.nativeElement,
        null,
        {
          renderer: 'svg',
        }
      );

      if (this.chartOption) {
        this.echartsInstance.setOption(this.chartOption);
      }
      this.addLegendToggleHandler();
    }
  }

  private addLegendToggleHandler(): void {
    if (!this.echartsInstance || !this.chartOption?.series) return;

    const series = Array.isArray(this.chartOption.series)
      ? this.chartOption.series
      : [this.chartOption.series];

    const stackedBarNames = series
      .filter((s) => s.type === 'bar' && s.stack && s.name !== 'Spacer')
      .map((s) => s.name);

    const spacerIndex = series.findIndex((s) => s.name === 'Spacer');
    if (spacerIndex === -1) return;

    if (this.originalSpacerData.length === 0) {
      this.originalSpacerData = [...(series[spacerIndex].data as number[])];
    }

    this.echartsInstance.on('legendselectchanged', (params: any) => {
      const selected = params.selected;

      const allVisible = stackedBarNames.every((name) => {
        if (name) {
          return selected[name];
        }
      });

      const newSpacerData = allVisible
        ? this.originalSpacerData
        : this.originalSpacerData.map(() => 0);

      const updatedSeries = [...series];
      (updatedSeries[spacerIndex] as echarts.BarSeriesOption).data =
        newSpacerData;

      this.echartsInstance?.setOption({ series: updatedSeries }, false);
    });
  }

  private handleResize(): void {
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => {
      this.echartsInstance?.resize();
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.ngZone.runOutsideAngular(() => {
        this.echartsInstance?.resize();
      });
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }
}

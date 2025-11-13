import { Component, Input } from '@angular/core';
import { KpiCard } from '../../features/main/user-dashboard/model/dashboard.types';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-kpi-card',
  imports: [CardModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css',
})
export class KpiCardComponent {
  @Input({ required: true }) data!: KpiCard;
}

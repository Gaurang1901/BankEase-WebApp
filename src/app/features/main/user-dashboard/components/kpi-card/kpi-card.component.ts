import { Component, Input } from '@angular/core';
import { KpiCard } from '../../model/dashboard.types';
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

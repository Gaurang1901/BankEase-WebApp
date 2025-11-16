import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DetailListItem } from '../../models/account.model';

@Component({
  selector: 'app-detail-list',
  imports: [CommonModule, TagModule],
  templateUrl: './detail-list.component.html',
  styleUrl: './detail-list.component.css',
})
export class DetailListComponent {
  @Input() icon: string = 'pi-list';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input({ required: true }) items: DetailListItem[] = [];
}

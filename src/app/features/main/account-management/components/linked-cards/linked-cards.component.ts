import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { LinkedCard } from '../../models/account.model';

@Component({
  selector: 'app-linked-cards',
  imports: [CommonModule, TagModule],
  templateUrl: './linked-cards.component.html',
  styleUrl: './linked-cards.component.css',
})
export class LinkedCardsComponent {
  @Input({ required: true }) cards: LinkedCard[] = [];
}

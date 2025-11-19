import { Component, computed, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModel } from '../../models/card.model';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-card-item',
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.css',
})
export class CardItemComponent {
  readonly cardData = input.required<CardModel>();

  // Outputs
  readonly onBlock = output<CardModel>();
  readonly onViewTransactions = output<CardModel>();

  constructor() {
    effect(() => {
      console.log(this.cardData());
    });
  }

  // Computed Signals for Logic
  readonly backgroundClasses = computed(() => {
    return this.cardData().themeColor === 'blue'
      ? 'bg-gradient-to-br from-blue-600 to-blue-800'
      : 'bg-gradient-to-br from-orange-500 to-orange-700';
  });

  readonly tagClasses = computed(() => {
    return this.cardData().themeColor === 'blue'
      ? '!bg-green-500/20 !text-green-100 border border-green-400/30'
      : '!bg-green-900/40 !text-green-100 border border-green-400/30';
  });

  readonly formattedCardNumber = computed(() => {
    const num = this.cardData().cardNumber;
    // Mask all except last 4, format in groups of 4
    const last4 = num.slice(-4);
    const first4 = num.slice(0, 4);
    return `${first4} **** **** ${last4}`;
  });
}

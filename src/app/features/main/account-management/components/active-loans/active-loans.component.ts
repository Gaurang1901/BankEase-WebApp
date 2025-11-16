import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActiveLoan } from '../../models/account.model';

@Component({
  selector: 'app-active-loans',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './active-loans.component.html',
  styleUrl: './active-loans.component.css',
})
export class ActiveLoansComponent {
  @Input({ required: true }) loans: ActiveLoan[] = [];
}
